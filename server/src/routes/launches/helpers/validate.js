function validate(object, value){
    if(!object[value]) return {error: `${value} must exist`}
}
function validateDate(dateString){
    const date = new Date(dateString).toDateString()
    if(date === 'Invalid Date') return {error: date}
}
module.exports= {
    validate,
    validateDate
}