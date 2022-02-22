const search_box = document.getElementById('search-box');
const list = document.getElementById('search-option');
const bus_id = document.getElementById('bus-id')
const driver_id = document.getElementById('driver-id')
const date = document.getElementById('operation-date')
search_box.addEventListener('input',()=>{
    // console.log(list.options.length)
    let str = search_box.value;
    let matched = false;
    for (let i = 0; i < list.options.length; i++) {
        if (str === list.options[i].value){
            matched = list.options[i];
            break;
        }
    }

    if (matched){
        bus_id.value = matched.value;
        str = matched.innerHTML;
        str = str.split(',');
        // now str is []
        driver_id.value = str[0].trim();
        date.value = str[2].trim();
    }else{
        let partial = document.getElementById('partial')
        partial.innerHTML =
            ` <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Warning!</strong> Selected row is not valid.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    }


})