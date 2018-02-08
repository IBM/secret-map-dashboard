/**
 * Enrolls a user with the respective CA.
 */
var User = require('fabric-client/lib/User');
export default async function (client, enrollmentID, enrollmentSecret, ca, {
  mspId,
  adminUser,
  affiliationOrg
}) {
  try {
    if(!enrollmentID && enrollmentID === "") {
      throw new Error(`Invalid User Id`);
    }
    let user = await client.getUserContext(enrollmentID, true);
    if(user && user.isEnrolled()) {
      return user;
    }
    try {
      if(!enrollmentSecret || enrollmentSecret === "") {
        //console.log('Initiate member ' + enrollmentID + " registration to " + affiliationOrg);
        enrollmentSecret = await ca.register({
          enrollmentID: enrollmentID,
          affiliation: affiliationOrg,
          maxEnrollments: 1,
          role: 'client'
        }, adminUser);
        //console.log("Successfully registered user " + enrollmentID + " with secret " + enrollmentSecret);
      }
    } catch(e) {
      throw new Error(`Failed to register User. Error: ${e.message}`);
    }
    try {
      const enrollment = await ca.enroll({
        enrollmentID,
        enrollmentSecret
      });
      user = new User(enrollmentID, client);
      await user.setEnrollment(enrollment.key, enrollment.certificate, mspId);
      await client.setUserContext(user);
      return user;
    } catch(e) {
      throw new Error(`Failed to enroll and persist User. Error: ${e.message}`);
    }
  } catch(e) {
    throw new Error(`Could not get UserContext! Error: ${e.message}`);
  }
}