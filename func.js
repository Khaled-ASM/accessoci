fdk.handle(function(input, ctx){
  let name = 'World';
  if (input.name) {
    name = input.name;
  }
  console.log(ctx.httpGateway);
  return {"ctx":ctx.httpGateway}
})
