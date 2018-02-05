/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"strconv"
	"strings"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// ============================================================================================================================
// Make Purchase - creates purchase Contract
// Inputs - sellerID, userID, productID, quantity
// ============================================================================================================================
func (t *SimpleChaincode) makePurchase(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments")
	}
	var err error

	//creates contract struct with properties, and get sellerID, userID, productID, quantity from args
	var contract Contract
	contract.Id = "c" + randomInts(10)
	contract.SellerId = args[0]
	contract.UserId = args[1]
	contract.ProductId = args[2]
	quantity, err := strconv.Atoi(args[3])
	if err != nil {
		return shim.Error("4th argument 'quantity' must be a numeric string")
	}
	contract.Quantity = quantity

	//get seller
	sellerAsBytes, err := stub.GetState(contract.SellerId)
	if err != nil {
		return shim.Error("Failed to get seller")
	}
	var seller Seller
	json.Unmarshal(sellerAsBytes, &seller)
	if seller.Type != TYPE_SELLER {
		return shim.Error("Not seller type")
	}

	//find the product
	var product Product
	productFound := false
	for h := 0; h < len(seller.Products); h++ {
		if seller.Products[h].Id == contract.ProductId {
			productFound = true
			product = seller.Products[h]
			break
		}
	}

	//if product not found return error
	if productFound != true {
		return shim.Error("Product not found")
	}

	//calculates cost and assigns to contract
	contract.Cost = product.Price * contract.Quantity
	//assign 'Pending' state
	contract.State = STATE_PENDING

	// get user's current state
	var user User
	userAsBytes, err := stub.GetState(contract.UserId)
	if err != nil {
		return shim.Error("Failed to get user")
	}
	json.Unmarshal(userAsBytes, &user)
	if user.Type != TYPE_USER {
		return shim.Error("Not user type")
	}

	//check if user has enough Fitcoinsbalance
	if user.FitcoinsBalance < contract.Cost {
		return shim.Error("Insufficient funds")
	}

	//store contract
	contractAsBytes, _ := json.Marshal(contract)
	err = stub.PutState(contract.Id, contractAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	//append contractId
	user.ContractIds = append(user.ContractIds, contract.Id)

	//update user's state
	updatedUserAsBytes, _ := json.Marshal(user)
	err = stub.PutState(contract.UserId, updatedUserAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	//return contract info
	return shim.Success(contractAsBytes)

}

// ============================================================================================================================
// Transact Purchase - update user account, update seller's account and product inventory, update contract state
// Inputs - contractID, newState(complete or declined)
// ============================================================================================================================
func (t *SimpleChaincode) transactPurchase(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments")
	}

	//get contractID args
	contract_id := args[0]
	newState := args[1]

	// Get contract from the ledger
	contractAsBytes, err := stub.GetState(contract_id)
	if err != nil {
		return shim.Error("Failed to get user")
	}
	var contract Contract
	json.Unmarshal(contractAsBytes, &contract)

	//if current contract state is pending, then execute transaction
	if contract.State == STATE_PENDING {

		if newState == STATE_COMPLETE {

			// get user's current state
			var user User
			userAsBytes, err := stub.GetState(contract.UserId)
			if err != nil {
				return shim.Error("Failed to get user")
			}
			json.Unmarshal(userAsBytes, &user)
			if user.Type != TYPE_USER {
				return shim.Error("Not user type")
			}

			//update user's FitcoinsBalance
			if (user.FitcoinsBalance - contract.Cost) >= 0 {
				user.FitcoinsBalance = user.FitcoinsBalance - contract.Cost
			} else {
				return shim.Error("Insufficient fitcoins")
			}

			// get seller's current state
			var seller Seller
			sellerAsBytes, err := stub.GetState(contract.SellerId)
			if err != nil {
				return shim.Error("Failed to get user")
			}
			json.Unmarshal(sellerAsBytes, &seller)
			if seller.Type != TYPE_SELLER {
				return shim.Error("Not seller type")
			}

			//update seller's FitcoinsBalance
			seller.FitcoinsBalance = seller.FitcoinsBalance + contract.Cost

			//update seller's product count
			productFound := false
			for h := 0; h < len(seller.Products); h++ {
				if seller.Products[h].Id == contract.ProductId {
					productFound = true
					seller.Products[h].Count = seller.Products[h].Count - contract.Quantity
					break
				}
			}

			//if product not found return error
			if productFound != true {
				return shim.Error("Product not found")
			}

			//update users state
			updatedUserAsBytes, _ := json.Marshal(user)
			err = stub.PutState(contract.UserId, updatedUserAsBytes)
			if err != nil {
				return shim.Error(err.Error())
			}

			//update seller's state
			updatedSellerAsBytes, _ := json.Marshal(seller)
			err = stub.PutState(contract.SellerId, updatedSellerAsBytes)
			if err != nil {
				return shim.Error(err.Error())
			}
		}

		// update contract state
		contract.State = STATE_COMPLETE

		// update contract state on ledger
		updatedContractAsBytes, _ := json.Marshal(contract)
		err = stub.PutState(contract.Id, updatedContractAsBytes)
		if err != nil {
			return shim.Error(err.Error())
		}

		//return contract info
		return shim.Success(updatedContractAsBytes)

	} else {
		return shim.Error("Contract already Complete or Declined")
	}

}

// ============================================================================================================================
// Get all user contracts
// Inputs - userID
// ============================================================================================================================
func (t *SimpleChaincode) getAllUserContracts(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments")
	}
	var err error

	//get userID from args
	user_id := args[0]

	//get user
	userAsBytes, err := stub.GetState(user_id)
	if err != nil {
		return shim.Error("Failed to get user")
	}
	var user User
	json.Unmarshal(userAsBytes, &user)
	if user.Type != TYPE_USER {
		return shim.Error("Not user type")
	}

	//get user contracts
	var contracts []Contract
	for h := 0; h < len(user.ContractIds); h++ {
		//get contract from the ledger
		contractAsBytes, err := stub.GetState(user.ContractIds[h])
		if err != nil {
			return shim.Error("Failed to get contract")
		}
		var contract Contract
		json.Unmarshal(contractAsBytes, &contract)
		contracts = append(contracts, contract)
	}
	//change to array of bytes
	contractsAsBytes, _ := json.Marshal(contracts)
	return shim.Success(contractsAsBytes)

}

// ============================================================================================================================
// Get all contracts
// Inputs - (none)
// ============================================================================================================================
func (t *SimpleChaincode) getAllContracts(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	var contracts []Contract

	// ---- Get All Contracts ---- //
	resultsIterator, err := stub.GetStateByRange("c0", "c9999999999999999999")
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	for resultsIterator.HasNext() {
		aKeyValue, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		queryKeyAsStr := aKeyValue.Key
		queryValAsBytes := aKeyValue.Value
		fmt.Println("on contract id - ", queryKeyAsStr)
		var contract Contract
		json.Unmarshal(queryValAsBytes, &contract)
		contracts = append(contracts, contract)
	}

	//change to array of bytes
	contractsAsBytes, _ := json.Marshal(contracts)
	return shim.Success(contractsAsBytes)

}

//generate an array of random ints
func randomArray(len int) []int {
	a := make([]int, len)
	for i := 0; i <= len-1; i++ {
		a[i] = rand.Intn(10)
	}
	return a
}

// Generate a random string of ints with length len
func randomInts(len int) string {
	rand.Seed(time.Now().UnixNano())
	intArray := randomArray(len)
	var stringInt []string
	for _, i := range intArray {
		stringInt = append(stringInt, strconv.Itoa(i))
	}
	return strings.Join(stringInt, "")
}
