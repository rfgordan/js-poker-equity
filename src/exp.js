function myClass(i) {
  j=i
  this.h=i
}

var c = new myClass(10)

for (const [key, value] of Object.entries(c))
{
  console.log(key + " " + value);
}
