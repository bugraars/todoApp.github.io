const form= document.querySelector("#todo-form");
const todoInput=document.querySelector("#todo");
const todoList = document.querySelector(".list-group");

const firstCardBody =document.querySelectorAll(".card-body")[0];
const secondCardBody =document.querySelectorAll(".card-body")[1];

const filter =document.querySelector("#filter"); // Filtre-Arama Kutusu
const clearButton=document.querySelector("#clear-todos");// Silme butonu

eventListeners();

function eventListeners(){ 
    form.addEventListener("submit",addTodo); //Form submit olduğunda addTodo fonksiyonunu çalıştır.
    document.addEventListener("DOMContentLoaded",loadedAllTodosToUI); //DOMContentLoaded sayfa yükledindiğinde loadedAll... fonksiyonunu çalıştıracak.
    secondCardBody.addEventListener("click",deleteTodo); //cardBody'ye tıklandığında fonksiyonu çalıştır.
    filter.addEventListener("keyup",filterTodos); //filter kısmına tuşa basıp çekildeğinde filterTodos çalışacak.
    clearButton.addEventListener("click",clearAllTodos); //Tümünü sil butonu için click eventi ekledik -> clearAllTodos
}

function addTodo(e){
    let todos = getTodosFromStorage();//kıysalamak için storageden bilgi getirdik
    const newTodo = todoInput.value.trim() //todoInput alanına girilen değeri TRIM'le ve newTodo ya ata.
    //addTodoToUI Kısmında en sonda todoInput DEĞERİNİ sıfırladık Alt kısımlara bakabilirsin.
    if(newTodo === ""){
        showAlert("danger","Lütfen bir to-do giriniz.");
    }
    else if(todos.indexOf(newTodo)===-1){ //eğer aynısı yoksa ekleyecek
        addTodoToUI(newTodo);  
        addTodoToStorage(newTodo);
        showAlert("success","Başarılı bir şekilde eklendi...")  
    }
    else{
        showAlert("warning","Bu to-do zaten kayıtlı");
    }
    e.preventDefault(); //prevent fonksiyonu ile sayfanın submit olduğunda yenilenmesinin önüne geçtik. 
}

function showAlert(type,message){
    const alert= document.createElement("div");     //div oluşturup buna class ve message-textContent ekledik.
    alert.className=`alert alert-${type}`;
    alert.textContent=`${message}`;
    firstCardBody.appendChild(alert);   // karta alerti ekledik.

    setTimeout(function(){
        alert.remove();        
    },1500);
}

function filterTodos(e){
     const filterValue= e.target.value.toLowerCase();//filtreleme kutusuna girilen değerleri küçük olarak al (ararken büyük küçük sorununun önüne geçmek için)
     const listItems=document.querySelectorAll(".list-group-item"); // classı bu olanları getir yani LI elementi

     listItems.forEach(function(listItem){ //tüm li'lerde gez 
        const text = listItem.textContent.toLowerCase();

        if(text.indexOf(filterValue) === -1){
            //BULAMADI
            listItem.setAttribute("style","display : none !important"); /* setAttribute ile style verdik display:none yani görünmez yaptık.
            Ancak BOOTSTRAP kullandığımızdan dolayı d-flex block important kaldığından ekrandan gitmiyor. none !important yaparak çözüyoruz.*/
        }
        else listItem.setAttribute("style","display:block");

     })
}


function deleteTodo(e){ //fonksiyon a(linkin içerisindeki i elementine tıklandığında, class adıyla bularak ve üst evebeynlerini silerek çalışıyor.)
      if(e.target.className=== "fa fa-remove"){
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent); // Storageden silme fonksiyonuna hangisine tıkladığına dair bilgi yolluyoruz. (deletetodo)
        showAlert("success","To-do başarıyla silindi");
    }
}
function deleteTodoFromStorage(deletetodo){
    let todos = getTodosFromStorage();
    todos.forEach(function(todo,index){
        if(todo === deletetodo){
            todos.splice(index,1); //arrayden değeri sildik
        }
    })
    localStorage.setItem("todos",JSON.stringify(todos));
}

function clearAllTodos(){
    if(confirm("Tüm to-do'ları silmek istiyorsanız onaylayınız !")){
        //Arayüzden temizleme --- todoList.innerHTML=""; --- ile temizleyebilirdik ancak performans açısından tercih edilmez.
        while(todoList.firstElementChild != null){
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
    }
}

function loadedAllTodosToUI(){ //daha önce yazılan getTodosFromStorage ile todos içine localdekileri atadık.
    let todos=getTodosFromStorage();
    todos.forEach(function(e){// Todos'daki her eleman için daha önce yazdığımız fonksiyon ile arayüze aktarıyoruz.
        addTodoToUI(e);
    })
}

function getTodosFromStorage(){ //todos var mı diye kontrol ediyor ve yoksa oluşturuyoruz.
    let todos;
    if(localStorage.getItem("todos")===null){
        todos=[]; //Boş todos oluşturduk localde 
    }
    else
    todos=JSON.parse(localStorage.getItem("todos"));
    return todos;
}
function addTodoToStorage(newTodo){ //todos'a ekleme yapıyoruz.
    let todos=getTodosFromStorage();
    todos.push(newTodo); //boş todos'a newTodo value olarak ekledik.
    localStorage.setItem("todos",JSON.stringify(todos));
}


function addTodoToUI(newTodo){//Gelen Değeri "li" şeklinde UI ekleyecek.

    const listItem=document.createElement("li");    // li elementi oluşturuduk.
    listItem.className="list-group-item d-flex justify-content-between";    // li elementimize özellikler class vs. verdik.
    const link=document.createElement("a");     // oluşturulan li elementinin daha sonra içine koymak üzere a elementi oluşturduk.
    link.href="#"; link.className="delete-item"; link.innerHTML="<i class = 'fa fa-remove'></i>";   // a elementimize özellikler class vs. verdik.

    listItem.appendChild(document.createTextNode(newTodo));     // li'ye newTodo'yu çocuğu olarak ekledik. 
    listItem.appendChild(link);     // li'ye a'yı ekledik.

    todoList.appendChild(listItem);     //todoList'e listItem'ı ekledik.
    todoInput.value="";     // Arayüze Todo ekleme işlemi bittikten sonra TODO girme çubuğundaki değeri sıfırlamak için "BOŞ DEĞER" atadık. 

}



/*
<div class="alert alert-primary" role="alert">
  A simple primary alert—check it out!
</div>
*/