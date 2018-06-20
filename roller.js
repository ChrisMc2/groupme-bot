module.exports = function roller(req, request) {
  var name = request.body.name.split(" ");

  const att_dice = [
    { "score": 0, "number": 1, "type": 20 },
    { "score": 1, "number": 1, "type": 4 },
    { "score": 2, "number": 1, "type": 6 },
    { "score": 3, "number": 1, "type": 8 },
    { "score": 4, "number": 1, "type": 10 },
    { "score": 5, "number": 2, "type": 6 },
    { "score": 6, "number": 2, "type": 8 },
    { "score": 7, "number": 2, "type": 10 },
    { "score": 8, "number": 3, "type": 8 },
    { "score": 9, "number": 3, "type": 10 },
    { "score": 10, "number": 4, "type": 8 }
  ];
  function subTotal(total, num) {
    return total + num;
  }
  function random(max) {
    return Math.ceil(Math.random() * max);
  }
  function sorter(a, b) {return a-b};
  const br = "\r\n";

  if (req.errors.length != 0) {
    return req.errors.join("\n");
  }
  req.base = [];
  req.base.push(random(20));
  req.results_string =  `Sure thing, ${name[0]}!${br}${br}Rolling 1d20: ${req.base[0]}${br}`;

  if (req.level) {
    req.att_rolls = [];
    for (var i = 0; i < att_dice[req.level].number; i++) {
      req.att_rolls.push(random(att_dice[req.level].type));
    }

    req.results_string += `Rolling ${att_dice[req.level].number}d${att_dice[req.level].type}: ${req.att_rolls.join(', ')}.${br}`

    if (req.advantage) {
      req.results_string += `${br}Rolling with Advantage ${(req.advantage)}! Adding attribute roll${(req.advantage > 1) ? "s": ""}: `;
      for (var i = 0; i < req.advantage; i++) {
        req.att_rolls.push(random(att_dice[req.level].type));
        req.results_string += `${req.att_rolls[req.att_rolls.length-1]}`;
        if (i < (req.advantage-1)) req.results_string += ", ";
      }
      req.att_rolls.sort(sorter).reverse();
      req.results_string += `${br}Dropping: `
      for (var i = 0; i < req.advantage; i++) {
        req.results_string += `${req.att_rolls.pop()}`;
        if (i < (req.advantage-1)) req.results_string += ", ";        
      }
      req.results_string += `${br}`;
    }

    if (req.disadvantages) {
      req.results_string += `${br}Rolling with Disdvantage ${(req.disadvantage)}. Adding attribute roll${(req.disadvantage > 1) ? "s": ""}: `;
      for (var i = 0; i < req.disadvantage; i++) {
        req.att_rolls.push(random(att_dice[req.level].type));
        req.results_string += `${req.att_rolls[length-1]}`;
        if (i < (req.disadvantage-1)) req.results_string += ", ";
      }
      req.att_rolls.sort(sorter);
      req.results_string += `${br}Dropping: `
      for (var i = 0; i < req.disadvantage; i++) {
        req.results_string += `${req.att_rolls.pop()}`;
        if (i < (req.disadvantage-1)) req.results_string += ", ";
      }
      req.results_string += `${br}`;
    }
  } else {
    if (req.advantage == 0) {
      req.base.push(random(20));
      req.results_string += `Rolling with advantage! Second roll is ${req.base[1]}.${br}`
      req.base.sort(sorter).reverse();
      req.results_string += `Dropping low roll of ${req.base.pop()}.${br}`;
    }
    if (req.disadvantage == 0) {
      req.base.push(random(20));
      req.results_string += `Rolling with disadvantage. Second roll is ${req.base[1]}.${br}`
      req.base.sort(sorter);
      req.results_string += `Dropping high roll of ${req.base.pop()}.${br}`;
    }
  }

  req.base_exp_count = 0;
  while (req.base[req.base.length-1]==20) {
    req.base.push(random(20));
    req.base_exp_count++;
  }
  if (req.base_exp_count > 0) {
    req.results_string += `Wow! The d20 exploded ${req.base_exp_count} time${(req.base_exp_count > 1) ? "s": ""}! d20 rolls now: ${req.base.join(", ")}.${br}`
  }

  if (req.att_rolls){
    req.att_exp_count = 0;
    req.att_exp_current = 0;
    for (var i = 0; i < req.att_rolls.length; i++) {
      if (req.att_rolls[i]==att_dice[req.level].type) {
        req.att_exp_count++;
        req.att_exp_current++;
      }
    }
    while (req.att_exp_current > 0) {
      var next = random(att_dice[req.level].type);
      if (next==att_dice[req.level].type) {
        req.att_exp_count++;
        req.att_exp_current++;
      }
      req.att_rolls.push(next);
      req.att_exp_current--;
    }
    if (req.att_exp_count > 0) {
      req.results_string += `Wow! The d${att_dice[req.level].type} exploded ${req.att_exp_count} time${(req.att_exp_count > 1) ? "s": ""}! Attribute rolls now: ${req.att_rolls.join(", ")}.${br}`;
    }
  }

  req.total = req.base.reduce(subTotal);
  if (req.att_rolls) req.total += req.att_rolls.reduce(subTotal);
  req.results_string += `${br}Roll total: ${req.total}.`

  if (req.quiet) req.results_string = `${req.total}`;

  return req.results_string;
}