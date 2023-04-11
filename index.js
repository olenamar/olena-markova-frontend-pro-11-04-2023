import { getUserByName, getUserInfractions } from './user-api.js';

const getReasonForWorstInfractionLinkified = (username, callback) => {
    getUserByName(username, (user) => {
        getUserInfractions(user.id, (result) => {
            let foundIndex = 0;
            for(let i = 1; i < result.length; i++) {
                if(result[i].id > result[foundIndex].id) {
                    foundIndex = i;
                };
            };
            const { reason } = result[foundIndex];
            callback(reason.replace(/\b(http)(s)?:\/\/\S+/, match => `<a href='${match}' > ${match}</a>`)) 
        });
    });
};

const getReasonForMostRecentInfractionLinkified = (username, callback) => {
    getUserByName(username, (user) => {
	    getUserInfractions(user.id, (result) => {
	        let foundPoints = 0;
	        for (let i = 1; i < result.length; i++)	{
		        if (result[i].points > result[foundPoints].points) {
		            foundPoints = i;
		        };
	        };
            const { reason } = result[foundPoints];
	        callback(reason.replace(/\b(http)(s)?:\/\/\S+/, match => `<a href='${match}' > ${match}</a>`));
	    });
    });
};

export const getRelevantInfractionReasons = (username) => {
    return new Promise((resolve) =>	{
	    getReasonForWorstInfractionLinkified(username, (worst) => {
	        getReasonForMostRecentInfractionLinkified(username, (mostRecent) => {
		        resolve({mostRecent, worst});
		    });
	    });
    });
};