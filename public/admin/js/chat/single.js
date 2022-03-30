$(function() {

const chatForm = document.getElementById("chatForm");
const sessionId = document.querySelector(".session_id").value
const userId = document.querySelector(".user_id").value
const roomId = document.querySelector('.room_id').value
const socket = io();

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

const joinUser = { 
    sessionId,
    userId,
    roomId
 }

// Join User
socket.emit('joinUser', joinUser);

socket.on('message', (object) => {

    // getting our object datapoint    
    const sessionId = object.session_id

    // showing our messages
     showMessage(sessionId, object);

     // Scroll down
     chatForm.scrollTop = chatForm.scrollHeight
})

// Message submitted
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get message text
    const msg = e.target.elements.message.value;

    // Emit message to server
    socket.emit( 'chatMessage',  { sessionId, msg }  );


    // sending the messages in ajax
    $.ajax({
        url: '/user/message',
        method: 'POST',
        dataType: 'json',
        data: {
            sender: sessionId,
            sendee: userId,
            message: msg
        },
        success: function(response) {
            if(response.msg === "ok") {
                alert("It has been added already");
            }else {
                alert("It has not been added alreay");
            }
        },
        error: function(response) {
            alert("Server Error Occured")
        }
    })


      // Clear input
      e.target.elements.message.value = '';
      e.target.elements.message.focus();
})

// showing our message to DOM
function showMessage(session_Id, message) {

        if( session_Id == userId) {
            
               // this just gets the user input from the array

        const content_start = document.createElement('div')
        content_start.classList.add("d-flex", "justify-content-start", "mb-4")
    
        content_start.innerHTML = `

        <div class="img_cont_msg">
            <img src="../../admin/images/avatar/1.jpg" class="rounded-circle user_img_msg" alt=""/>
        </div>
        <div class="msg_cotainer">
           ${message.text}
            <span class="msg_time">${message.time}, Today</span>
        </div>
    
        `

        document.querySelector('.msg_card_body').appendChild(content_start)

        }else {
           
                    // this just gets the user input from the array

        const content_start = document.createElement('div')
        content_start.classList.add("d-flex", "justify-content-end", "mb-4")
    
        content_start.innerHTML = `
    
        <div class="msg_cotainer_send">
           ${message.text}
            <span class="msg_time_send">${message.time}, Today</span>
        </div>
        <div class="img_cont_msg">
    <img src="../../admin/images/avatar/2.jpg" class="rounded-circle user_img_msg" alt=""/>
        </div>
    
        `;

        document.querySelector('.msg_card_body').appendChild(content_start)

        }
        


    }





});