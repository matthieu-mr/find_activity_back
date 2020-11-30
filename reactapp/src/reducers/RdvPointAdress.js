export default function(rdvPoint =[], action) {
    // show particpant adress from form 
        if(action.type == 'addRdvPointAdress') {
            let array = []
            array.push(action.info)
          return array
        }
        else {
          return rdvPoint;
        }
    }