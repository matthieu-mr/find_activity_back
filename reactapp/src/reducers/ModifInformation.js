export default function(infoAdress ={}, action) {
    // show particpant adress from form 
        if(action.type == 'modifContact') {
            let item = action.info
            item.type="contact"
         
            return item
        }else if (action.type == 'modifActivity') {
            let item = action.info
            item.type="activity"
            return infoAdress
        }
        else {
            return infoAdress;
        }
    }