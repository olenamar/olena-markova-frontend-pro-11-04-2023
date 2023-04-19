import { getUserByName, getUserInfractions } from './user-api.js';

const urlReason = (reason) => {
  return reason.replace(/\b(http)(s)?:\/\/\S+/, match => `<a href='${match}' > ${match}</a>`);
}
  
const getReasonForWorstInfractionLinkified = async (username) => {
  try {
    const user = await getUserByName(username);
    const result = await getUserInfractions(user.id);
    let foundIndex = 0;
    let foundPoints = 0;
    for(let i = 1; i < result.length; i++) {
      if(result[i].id > result[foundIndex].id) {
          foundIndex = i;
      }
      if(result[i].points > result[foundPoints].points) {
        foundPoints = i;
      }
    };
    return {
      worst: urlReason(result[foundPoints].reason),
      mostRecent: urlReason(result[foundIndex].reason)
    }
    } catch (error) {
      console.log(`Error: ${error}`);
      return { worst: "", mostRecent: "" };
    }
}
  
export const getRelevantInfractionReasons = (username) => {
  return new Promise((resolve, reject) => {
    getReasonForWorstInfractionLinkified(username)
      .then(({ worst, mostRecent }) => resolve({ worst, mostRecent }))
      .catch(error => reject(error));
  });
};