export default function(userInformation = "", action) {
    if(action.type == 'informationUser') {
      let userInformation2 = action.item
      return userInformation;
    
    } else {
      return userInformation;
    }
}