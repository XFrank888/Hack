

window.onload = function() {
    firebase.initializeApp({
        apiKey: "AIzaSyBcEyyb8R47iNSIWCoHCbfey2D5U4GDeog",
        authDomain: "ezchat-a0c52.firebaseapp.com",
        databaseURL: "https://ezchat-a0c52-default-rtdb.firebaseio.com",
        projectId: "ezchat-a0c52",
        storageBucket: "ezchat-a0c52.appspot.com",
        messagingSenderId: "250652841906",
        appId: "1:250652841906:web:ab8b583e5a1448da4d36ab"
      });

    const storage = firebase.database()

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
        title.textContent = 'ezChat Demo-version 5'
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
  
        const join_container = document.createElement('div')
        const join_inner_container = document.createElement('div')
        const join_button_container = document.createElement('div')
        const join_button = document.createElement('button')
        const join_input_container = document.createElement('div')
        join_container.setAttribute('id', 'join_container')
        join_inner_container.setAttribute('id', 'join_inner_container')
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
              join_container.remove()
              upState.create_chat()
            }
          }else{
            join_button.classList.remove('enabled') // Enabled => Not able to join without typing anything
          }
        }
        join_button_container.append(join_button)
        join_input_container.append(join_input)
        join_inner_container.append(join_input_container, join_button_container)
        join_container.append(join_inner_container)
        document.body.append(join_container)
      }

      create_load(container_id){ // Dynamic Loading
        const container = document.getElementById(container_id)
        const loader = document.createElement('div')
        const loader_container = document.createElement('div')
        container.innerHTML = ''
        loader_container.setAttribute('class', 'loader_container')
        loader.setAttribute('class', 'loader')
  
      
        loader_container.append(loader)
        container.append(loader_container)
  
      }
      
      create_chat(){ // chat page once user has its own username id
        const upState = this;
        
        const box = document.getElementById('title_container')
        const title = document.getElementById('title')
        const chat_container = document.createElement('div')
        const chat_input_container = document.createElement('div')
        const chat_inner_container = document.createElement('div')
        const chat_content_container = document.createElement('div')
        const chat_input_send = document.createElement('button')
        const chat_input = document.createElement('input')
        box.classList.add('chat_title_container')
        title.classList.add('chat_title')
  
        chat_container.setAttribute('id', 'chat_container')
        chat_inner_container.setAttribute('id', 'chat_inner_container')
        
        chat_content_container.setAttribute('id', 'chat_content_container')
        chat_input_container.setAttribute('id', 'chat_input_container')
  
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
        const chat_logout_container = document.createElement('div')
        chat_logout_container.setAttribute('id', 'chat_logout_container')

        chat_logout.setAttribute('id', 'chat_logout')
        chat_logout.textContent = `${upState.get_name()} • logout`
        chat_logout.onclick = function(){ // clear the local storage
          localStorage.clear()
          upState.homePage()
        }
  
        chat_logout_container.append(chat_logout)
        chat_input_container.append(chat_input, chat_input_send)
        chat_inner_container.append(chat_content_container, chat_input_container, chat_logout_container)
        chat_container.append(chat_inner_container)
        document.body.append(chat_container)
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
        const chat_content_container = document.getElementById('chat_content_container')
        storage.ref('chats/').on('value', function(messages_object) {
          chat_content_container.innerHTML = '' // Clear the html text after we access the chat
          if(messages_object.numChildren() == 0){
            return
          }
  
  
          const messages = Object.values(messages_object.val());



          var guide = [] 
          var unordered = [] 
          var ordered = [] 
  
          for (var i, i = 0; i < messages.length; i++) {
            guide.push(i+1)
            unordered.push([messages[i], messages[i].index]);
          }

          guide.forEach(function(key) { 
            var found = false
            unordered = unordered.filter(function(item) {
              if(!found && item[1] == key) {

                ordered.push(item[0])
                found = true
                return false
              }else{
                return true
              }
            })
          })
  

          ordered.forEach(function(data) { // access storage and display the ordered info
            const message_content = document.createElement('p')

            const message_inner_container = document.createElement('div')
            const name = data.name
            const message_user = document.createElement('p')
            const message_container = document.createElement('div')
            const message_user_container = document.createElement('div')
            const message = data.message
            const message_content_container = document.createElement('div')
            message_content.setAttribute('class', 'message_content')
            message_user.textContent = `${name}`

            message_inner_container.setAttribute('class', 'message_inner_container')
            message_user.setAttribute('class', 'message_user')
  
            message_content_container.setAttribute('class', 'message_content_container')
            message_container.setAttribute('class', 'message_container')
  
            message_user_container.setAttribute('class', 'message_user_container')
  


  

            message_content.textContent = `${message}`
  
            message_user_container.append(message_user)
            message_content_container.append(message_content)
            message_inner_container.append(message_user_container, message_content_container)
            message_container.append(message_inner_container)
  
            chat_content_container.append(message_container)
          });
          chat_content_container.scrollTop = chat_content_container.scrollHeight;
      })
  
      }
    }
    const app = new ezChat() // Ultimately call the ezChat!

    if(app.get_name() != null){
      app.chat()
    }
  }
  