const findMissingCredentials = (body, requiredFields) => {
    const credentials = Object.keys(body)

    const missingCredentials = requiredFields.filter(requiredField => {
        return !credentials.includes(requiredField)   
    })

    return missingCredentials
}

const dateToCron = (date) => {
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const days = date.getDate();
    const months = date.getMonth() + 1;
    const dayOfWeek = date.getDay();

    return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
};

module.exports = {
    findMissingCredentials,
    dateToCron
}