window.onload = function() {
    firebase.initializeApp({
      apiKey: "AIzaSyDVSer-s7viOk8GQVA-LuvW9PmOwODoDAM",
      authDomain: "echat2-d7447.firebaseapp.com",
      projectId: "echat2-d7447",
      storageBucket: "echat2-d7447.appspot.com",
      messagingSenderId: "229183380834",
      appId: "1:229183380834:web:9c8e364cd30b5511e9a03b",
      measurementId: "G-W29XSXK2VG"
    });

    const storage = firebase.database();

    class ezChat{
      
      homePage(){ // it creates a homepage in html

        document.body.innerHTML = ''
        this.create_title()// The homepage needs to have title as well as nickName form
        this.nickName_form() // call these two function
      }
      
      chat(){ // it also needs to create title but once the user enter a nickname it returns the chat page
        this.create_title()
        this.create_chat()
      }
      
      create_title(){ // Create a html format in javascript (The title)
        const title = document.createElement('h2')
        const little_box = document.createElement('div')
        const box = document.createElement('div')
        little_box.setAttribute('id', 'title_inner_container')
        title.textContent = 'ezChat Demo'
        title.setAttribute('id', 'title')
        little_box.append(title)
        box.setAttribute('id', 'title_container')

        document.body.append(box)
        
        little_box.append(title)
        box.append(little_box)
        

        // document.innerHTML("<body> <div id='title_container'> <div id='title_inner_container'> <h1 id='title'> ezChat Demo-version 5 </h1> </div> </div></body>");
        // var title_container = getElementById("title_container")
        // var title = getElementById("title")
        // var title_inner_container = getElementById("title_inner_container")


      }

      nickName_form(){ //Allows users to enter a nickname in order to enter the chat page
        
        const upState = this;
  
        const j_box = document.createElement('div')
        const j_little_box = document.createElement('div')
        const join_button_container = document.createElement('div')
        const join_button = document.createElement('button')
        const join_input_container = document.createElement('div')
        j_box.setAttribute('id', 'join_container')
        j_little_box.setAttribute('id', 'join_inner_container')
        join_button_container.setAttribute('id', 'join_button_container')
        join_button.setAttribute('id', 'join_button')
        join_button.innerHTML = 'Join <i class="fas fa-sign-in-alt"></i>'
  
        join_input_container.setAttribute('id', 'join_input_container')
  
        const join_input = document.createElement('input')
        join_input.setAttribute('id', 'join_input')
        join_input.setAttribute('maxlength', 15)
        join_input.placeholder = 'Your preferred Nickname'
        
        join_input.onkeyup  = function(){ // Join button
          if(join_input.value.length > 0){// Dynamic check to see if user enter a nickname or not
            join_button.classList.add('enabled') // Enable => to enter

            join_button.onclick = function(){
              upState.save_name(join_input.value) // Save to the storage
              j_box.remove()
              upState.create_chat()
            }
          }else{
            join_button.classList.remove('enabled') // Enabled => Not able to join without typing anything
          }
        }
        join_button_container.append(join_button)
        join_input_container.append(join_input)
        j_little_box.append(join_input_container, join_button_container)
        j_box.append(j_little_box)
        document.body.append(j_box)
      }

      create_load(container_id){ // Dynamic Loading
        const container = document.getElementById(container_id)
        const wait = document.createElement('div')
        const wait_box = document.createElement('div')
        container.innerHTML = ''
        wait_box.setAttribute('class', 'loader_container')
        wait.setAttribute('class', 'loader')
  
      
        wait_box.append(wait)
        container.append(wait)
  
      }
      
      create_chat(){ // chat page once user has its own username id
        const upState = this;
        
        const box = document.getElementById('title_container')
        const title = document.getElementById('title')
        const c_box = document.createElement('div')
        const chat_input_box = document.createElement('div')
        const c_little_box = document.createElement('div')
        const ccc = document.createElement('div')
        const chat_input_send = document.createElement('button')
        const chat_input = document.createElement('input')
        box.classList.add('chat_title_container')
        title.classList.add('chat_title')
  
        c_box.setAttribute('id', 'chat_container')
        c_little_box.setAttribute('id', 'chat_inner_container')
        
        ccc.setAttribute('id', 'chat_content_container')
        chat_input_box.setAttribute('id', 'chat_input_container')
  
        // const chat_input_send = innerHTML = <button id='chat_input_send' disabled= 'true' ><i class='far fa-paper-plane'>send</i></button>
        
        chat_input_send.setAttribute('id', 'chat_input_send')
        chat_input_send.setAttribute('disabled', true)
        chat_input_send.innerHTML = `<i class="far fa-paper-plane">Send</i>`
  
        // Add attributes
        chat_input.setAttribute('id', 'chat_input')
        chat_input.setAttribute('maxlength', 1000)
        

        chat_input.placeholder = `${upState.get_name()}, share your thoughts` //Get the nickname from the user
        chat_input.onkeyup  = function(){
          if(chat_input.value.length > 0){
            chat_input_send.removeAttribute('disabled')
            chat_input_send.classList.add('enabled')
            chat_input_send.onclick = function(){
              chat_input_send.setAttribute('disabled', true)
              chat_input_send.classList.remove('enabled')
              if(chat_input.value.length <= 0){
                return
              }
              upState.create_load('chat_content_container') // dynamic loading to let user wait
              upState.send_message(chat_input.value) // Send message to the chat feed
              
              chat_input.value = '' // clear the input box once it push the send button
              chat_input.focus()
            }
          }else{
            chat_input_send.classList.remove('enabled')
          }
        }
  
        const chat_logout = document.createElement('button')
        const logout_box = document.createElement('div')
        logout_box.setAttribute('id', 'chat_logout_container')

        chat_logout.setAttribute('id', 'chat_logout')
        chat_logout.textContent = `${upState.get_name()} • logout`
        chat_logout.onclick = function(){ // clear the local storage
          localStorage.clear()
          upState.homePage()
        }
  
        logout_box.append(chat_logout)
        chat_input_box.append(chat_input, chat_input_send)
        c_little_box.append(ccc, chat_input_box, logout_box)
        c_box.append(c_little_box)
        document.body.append(c_box)
        upState.create_load('chat_content_container') // Loading dynamic again
        upState.refresh_chat()
      }
  
      save_name(name){
        // Save name to localStorage
        localStorage.setItem('name', name)
      }
      
      send_message(message){ // Save to the server
        const upState = this
        if(upState.get_name() == null && message == null){
          return
        }
  
        
        storage.ref('chats/').once('value', function(message_object) { // get info from the server
          const index = parseFloat(message_object.numChildren()) + 1
          storage.ref('chats/' + `message_${index}`).set({
            name: upState.get_name(),
            message: message,
            index: index
          })
          .then(function(){
            upState.refresh_chat() // refresh the chat after sent the message
          })
        })
      }
      get_name(){ // access to the server again to get the game

        if(localStorage.getItem('name') != null){
          return localStorage.getItem('name')
        }else{
          this.homePage()
          return null
        }
      }
      refresh_chat(){
        const ccc = document.getElementById('chat_content_container')
        storage.ref('chats/').on('value', function(messages_object) {
          ccc.innerHTML = '' // Clear the html text after we access the chat
          if(messages_object.numChildren() == 0){
            return
          }
  
  
          const messages = Object.values(messages_object.val());



          var sequence = [] 
          var o1 = [] 
          var o2 = [] 
  
          for (var i, i = 0; i < messages.length; i++) {
            sequence.push(i+1)
            o1.push([messages[i], messages[i].index]);
          }

          sequence.forEach(function(key) { 
            var found = false
            o1 = o1.filter(function(item) {
              if(!found && item[1] == key) {

                o2.push(item[0])
                found = true
                return false
              }else{
                return true
              }
            })
          })
  

          o2.forEach(function(data) { // access storage and display the ordered info
            const message_content = document.createElement('p')

            const m_little_box = document.createElement('div')
            const name = data.name
            const message_user = document.createElement('p')
            const message_container = document.createElement('div')
            const message_user_container = document.createElement('div')
            const message = data.message
            const m_box = document.createElement('div')
            message_content.setAttribute('class', 'message_content')
            message_user.textContent = `${name}`

            m_little_box.setAttribute('class', 'message_inner_container')
            message_user.setAttribute('class', 'message_user')
  
            m_box.setAttribute('class', 'message_content_container')
            message_container.setAttribute('class', 'message_container')
  
            message_user_container.setAttribute('class', 'message_user_container')
  


  

            message_content.textContent = `${message}`
  
            message_user_container.append(message_user)
            m_box.append(message_content)
            m_little_box.append(message_user_container, m_box)
            message_container.append(m_little_box)
  
            ccc.append(message_container)
          });


          ccc.scrollTop = ccc.scrollHeight;
      })
  
      }
    }
    const app = new ezChat() // Ultimately call the ezChat!

    if(app.get_name() != null){
      app.chat()
    }

  }

setInterval(() => {
  let nodesDelete = [];
  let container = document.getElementById("chat_content_container");
  container.childNodes.forEach((child) => {
    if (child.innerText.includes("tian cai")){
      nodesDelete.push(child);
    }
    // if (child.innerText.includes("Hopefully, you will find this piece of software helpful!")){
    //   console.log(child.childNodes[0]);
    //   child.childNodes[0].childNodes[0].textContent = <p class="message_user">Yuxuan</p>;
    // }
  })
  nodesDelete.forEach((node) => {
    container.removeChild(node);
  });
}, 100);

  