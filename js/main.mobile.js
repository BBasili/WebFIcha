
function swipeleft(){
  $(".collapsible").sortable({
    connectWith: '.collapsible',
    placeholder: 'hover',
    containment: '#vantagemWrap',
  });
}


// function getItems() {
//   var items = $('#vantagemDrop .collapsible').sortable(
//     [
//       $('#vantNome'),
//       {
//         "id":"vantNome",
//         "id":"vantCusto",
//         "id":"vantDescr"
//       }
//     ]
//   );
//  console.log(items);
// // var itemStr = items.join(',');
// // console.log(itemStr);
// }
