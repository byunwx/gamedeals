function displayResults(data) {
  // Add to the table here...
  console.log(data.length)
  if (data.length==0) {
    window.location.href="/";
  }
  for (var i = 0; i < data.length; i++) {
    const newTr=$("<tr>")
    let newimg=$("<td>").html("<img src="+data[i].img+">");
    let newtitle=$("<td>").html(data[i].title);
    let newlink=$("<td>").html("<a href="+data[i].link+" target='_blank'>"+data[i].link+"</a>");
    let newprice=$("<td>").html(data[i].price);
    newTr.append(newimg, newtitle, newlink, newprice);
    $("tbody").append(newTr);
  }
}

$.getJSON("/all", function(data) {
  // Call our function to generate a table body

  displayResults(data);
});


$("#title-sort").on("click", function(){
  $("tbody").empty();
  $.getJSON("/title", function(data) {
    // Call our function to generate a table body
    displayResults(data);
  });

})
$("#price-sort").on("click", function(){
  $("tbody").empty();
  $.getJSON("/price", function(data) {
    // Call our function to generate a table body
    displayResults(data);
  });

})
$("#pc-games").on("click", function(){
  window.location.href="/pc";
})
$("#xbox-games").on("click", function(){
  window.location.href="/xbox";
})
$("#ps4-games").on("click", function(){
  window.location.href="/ps4";
})
