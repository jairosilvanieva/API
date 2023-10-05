function getInfo(url){
    return new Promise(function (resolve, reject){
        let request = new XMLHttpRequest();
        request.open("GET", url);
        request.responseType="json";
        request.onload = function(){
            if(request.status === 200){
                resolve(request.response);
            }else{
                reject("Ha ocurrido un error" + request.status);
            }
        }
        request.onerror = function(){
            reject("Ha ocurrido un error");
        }
        request.send();
        
    });
}


/*
let rCompanys=getInfo("https://utn-lubnan-api-1.herokuapp.com/api/Company").then(
    (dataCompany)=>{
    for(let i=0;i<dataCompany.length;i++){
        companys[i]=dataCompany[i];
    }
}).catch((error)=>{
    console.log(error);
});
*/
function listarCompanys(company){
    let lista = document.getElementById("listaCompanias");
    let li = document.createElement("li");
    li.innerHTML=company;
    lista.appendChild(li);
}

function listaEmployee(employee){
    let lista = document.getElementById("listaCompanias");
    let li = document.createElement("li");
    li.innerHTML=employee;
    lista.appendChild(li);
}

function postInfo(url, body){
    return new Promise(function (resolve, reject){
        let request = new XMLHttpRequest();
        request.open("POST", url);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.responseType="json";
        request.onload = function(){
            if(request.status === 200){
               resolve(request.response);
            }else{
                reject("Ha ocurrido un error");
            }
        }
        request.onerror = function(){
            return reject("Ha ocurrido un error");
        }
        request.send(body);
    });
}

/*
postInfo("https://utn-lubnan-api-1.herokuapp.com/api/Employee").then((response)=>{
    console.log("anda");
}).catch((error)=>{
    console.log(error);
});
*/

function deleteInfo(url){
    return new Promise(function (resolve, reject){
        let request = new XMLHttpRequest();
        request.open("DELETE", url);
        request.onload = function(){
            if(request.status === 200 && request.readyState===4){
                resolve(request.response);
            }else{
                reject("Ha ocurrido un error");
            }
        }
        request.onerror = function(){
            reject("Ha ocurrido un error");
        }
        request.send();
        
    });
}
/*
deleteInfo("https://utn-lubnan-api-1.herokuapp.com/api/Employee/1001").then((response)=>{
    console.log("anda");
}).catch((error)=>{
    console.log("no anda");
});
*/
/*
let employee = getInfo("https://utn-lubnan-api-1.herokuapp.com/api/Employee").then((dataEmployee)=>{
    for(let i=0;i<dataEmployee.length;i++){
        employees[i]=dataEmployee[i];
        
        ]listarCompanys("Id Employee: "+dataEmployee[i].employeeId + "<br>"+"Id Company: "+ dataEmployee[i].companyId+"<br>"+"Name Company: "+companys[dataEmployee[i].companyId-1].name+"<br>"+ 
        "Firs Name: "+dataEmployee[i].firstName + "<br>" + "Last Name: "+ dataEmployee[i].lastName +"<br>"+"Email: "+ dataEmployee[i].email+"<br>"+"<br>");
        
    } 
}).catch((error)=>{
    console.log(error);
}); */
let companys = [];
let employees = [];

/*
async function cargaDatosSecuencial(){
   companys=await getInfo("https://utn-lubnan-api-1.herokuapp.com/api/Company");
   employees=await getInfo("https://utn-lubnan-api-1.herokuapp.com/api/Employee");
        for(let i=0; i<employees.length; i++)
    {
        createRow(companys[employees[i].companyId-1],employees[i]);
    }
}*/

let loadData = document.getElementById("bCarga");
loadData.addEventListener("click",async function cargaDatosSecuencial(){
    
    await getInfo("https://utn-lubnan-api-1.herokuapp.com/api/Company")
    .then((response) => {
        companys = response;
    })
    .catch((error)=>{
        console.log(error);
    });

    await getInfo("https://utn-lubnan-api-1.herokuapp.com/api/Employee")
    .then((response) => {
        employees = response;
    })
    .catch((error)=>{
        console.log(error);
    });    
    
    for(let i=0; i<employees.length; i++)
     {
         createRow(companys[employees[i].companyId-1],employees[i]);
     }
 });

 let subirData = document.getElementById("bSubir");
subirData.addEventListener("click", async function subeDatos(){
    let body = JSON.stringify({
        "employeeId": 2,
        "companyId": 10,
        "firstName": "Nahuel",
        "lastName": "Mirabella",
        "email": "nahuel@gmail.com" 
        });
    let subir = await postInfo("https://utn-lubnan-api-1.herokuapp.com/api/Employee", body);
 }
 );

 let borrarData = document.getElementById("bEliminar");
 borrarData.addEventListener("click", async function borrarData(){
    await deleteInfo("https://utn-lubnan-api-1.herokuapp.com/api/Employee/1001")
    .then((response) => {
        console.log(response.status);
    })
    .catch((response)=>{
        console.log("Borrado con exito");
    });
 });
 
/*CONCURRENTE*/

function concurencia(){
    return Promise.all([getInfo("https://utn-lubnan-api-1.herokuapp.com/api/Company"),getInfo("https://utn-lubnan-api-1.herokuapp.com/api/Employee")])
    .then((response)=>{ 
        for(let i=0; i<response[1].length; i++){
            createRow(response[0][response[1][i].companyId-1], response[1][i]);
        }
    })
    .catch((err)=>{console.log(err)});
}

let table = document.getElementById("table");

function createRow(company, employee){
    table.innerHTML+=`<tr>
    <td >${employee.employeeId}</td>
    <td >${employee.companyId}</td>
    <td >${company.name}</td>
    <td >${employee.firstName}</td>
    <td >${employee.lastName}</td>
    <td >${employee.email}</td>
</tr>`;
}
concurencia();
///cargaDatosSecuencial();
