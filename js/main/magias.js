// Initialize Firebase
var config = {
  apiKey: "AIzaSyAJ47d5_BQ_TLV5qvFc6jZVlO_RxJM_VG0",
  authDomain: "ficha-ff32c.firebaseapp.com",
  databaseURL: "https://ficha-ff32c.firebaseio.com",
  projectId: "ficha-ff32c",
  storageBucket: "ficha-ff32c.appspot.com",
  messagingSenderId: "714897886749"
};
firebase.initializeApp(config);

var provider = new firebase.auth.GoogleAuthProvider();
var user;

function login(){
  firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  user = firebase.auth().currentUser;
  username = user.displayName;
  useremail = user.email;
  userphotoUrl = user.photoURL;
  useruid = user.uid;
  // pageRed();

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
       window.location = 'status.html';
    } else {
      console.log(error.message);
    }
  });
    // ...
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}

function pageRed(){
  firebase.auth().onAuthStateChanged(function(user) {
    username = user.displayName;
    userphotoUrl = user.photoURL;
    useremail = user.email;

    $('.imgUser>img').attr('src', userphotoUrl);
    $('#userInfo .userName').text(username);
    $('#userInfo .userMail').text(useremail);

    var baseData = firebase.database().ref('Users/' + user.displayName);
    var statusRef = baseData.child('Personagem');
    var magiasRef = firebase.database().ref('Magias/');
    if (user) {
      addLoader();
      $('.loader').addClass('scale-in');
      var childSnapshot = '';
      magiasRef.on('value', function(snapshot) {
        var childData = snapshot.val();
        snapshot.forEach(function(childSnapshot){
          var childSnapshotData = childSnapshot.val();
          var modalId = childSnapshotData.Nome.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').toLowerCase();
          $('#listMagias>ul').append('<li id="'+modalId+'" class="mix collection-item '+childSnapshotData.Escola+'">'+childSnapshotData.Nome+'</li>');
          if ($('#listMagias>ul>li').length > 0) {
          $('body').append('<script src="js/main/jquery.mixitup.min.js"></script><script src="js/main/filter.js"></script>');
          $('.collection-item').click(function() {
            $(this).append('<div id="'+modalId+'" class="modal"><div class="modal-content"><p>'+childData.Descricao+'</p></div><div class="modal-footer"><a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">Agree</a></div></div>')
            if ($(this).find('.modal').length > 0) {
              if ($(this).find('.modal').attr('id') == $(this).attr('id')) {
                console.log($(this).find('.modal'));
                $('.modal').modal({
                    dismissible: true, // Modal can be dismissed by clicking outside of the modal
                    opacity: .5, // Opacity of modal background
                    inDuration: 300, // Transition in duration
                    outDuration: 200, // Transition out duration
                    startingTop: '4%', // Starting top style attribute
                    endingTop: '10%', // Ending top style attribute
                    complete: function() {
                      $(this).remove();
                     }
                  }
                );
                $(this).find('.modal').modal('open');
              }
              // console.log('modal id: '+$(this).find('.modal').attr('id')+'\n'+'this id: '+$(this).attr('id'));
            }
            if ($('.modal').attr(''+modalId+'') == $(this).attr('id')) {
            }
          });
        }
        });
      });
    } else {
      // No user is signed in.
    }
    function addVant(snapshot){
      $('#vantagemList li label').on('click', function(event) {
        event.preventDefault();
        var item = $(this).parent().find('input').attr('checked','checked');
        var childData = snapshot.val();
        var vantNome = childData.Nome;
        var itemNome = item.attr('id');
        var itemDescr = $(this).parent().parent().find('#vantDescr').text();
        var itemCusto = $(this).parent().parent().find('#vantCusto').text();
        setTimeout(function () {
          var statusRef = baseData.child('Vantagens/');
          var vantagensRef = statusRef.child(item.attr('id'));
          vantagensRef.set({
              Nome: itemNome,
              Descricao: itemDescr,
              Custo: itemCusto
          });
          addLoader();
        }, 750);
        $(this).off();
      });
    }
  });
}
function sair(){
  firebase.auth().signOut().then(function() {
    window.location = 'index.html';
    console.log(' saiu ');
  }, function(error) {
    // An error happened.
  });
}
function addLoader(){
  var loader = $('<div class="preloader-wrapper big active"><div class="spinner-layer spinner-blue"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-red"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-yellow"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-green"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>')

  $('.loader').append(loader);
}
function remove(){
  user = firebase.auth().currentUser;
  username = user.displayName;

  $('#vantagemDrop ul li').on('click', '#removeItem', function(event) {
    event.preventDefault();
    var vantId = $(this).parent().attr('id');
    var baseData = firebase.database().ref('Users/' + user.displayName + '/Vantagens/' + vantId);
    baseData.remove();
    setTimeout(function () {
      location.reload();
    }, 500);
  });
}
