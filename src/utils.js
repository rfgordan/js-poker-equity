function Nums2CardString(x) {
  switch (x) {
    case 12:
	return "A";
    case 11:
	return "K";
    case 10:
	return "Q";
    case 9:
	return "J";
    default:
	return (x+2).toString();

    }
}

function CardString2Num(s) {
  switch (s) {
    case "A":
      return 12;
    case "K":
      return 11;
    case "Q":
      return 10;
    case "J":
      return 9;
    default:
      return +s;
  }
}

//takes specific card (incl. suit) and returns string rep
function GetSingleString(suit,num) {
  let labelString = "";
  switch (suit) {
    case 0:
      labelString = "\u2660";
      break;
    case 1:
      labelString = "\u2665";
      break;
    case 2:
      labelString = "\u2666";
      break;
    case 3:
      labelString = "\u2663";
      break;
  }

  return Nums2CardString(num)+labelString;
}

//takes two card nums w/o suits and returns string rep
function GetPairString(i,j) {
  let labelString = "";
  if (i>j)
  {
      labelString += "s";
  } else if (j>i) {
      labelString += "o";
      let temp; //switch order of nums to make label consistent
      temp=i;
      i=j;
      j=temp;
  }
  labelString=Nums2CardString(i)+Nums2CardString(j)+labelString;
  return labelString;
}

module.exports = {
  Nums2CardString: Nums2CardString,
  CardString2Num: CardString2Num,
  GetPairString: GetPairString,
  GetSingleString: GetSingleString
}
