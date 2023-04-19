const parseCrossword = crossword => {
  return crossword
    .trim()
    .split('\n')
    .map(row =>
      row.split('').map(cell => (cell === '.' ? -1 : parseInt(cell, 10)))
    );
};
const findWordBeginnings = puzzleNumbers => {
  return puzzleNumbers
    .flatMap((row, rowIndex) =>
      row.map((cell, colIndex) => ({ row: rowIndex, col: colIndex }))
    )
    .filter(cell => puzzleNumbers[cell.row][cell.col] > 0);
};
const isValidInput = (crossword, words) => {
  return (
    typeof crossword === 'string' &&
    Array.isArray(words) &&
    words.every(word => typeof word === 'string') &&
    /^[.\n012]+$/.test(crossword)
  );
};
const crosswordSolver = (crossword, words) => {
  if (!isValidInput(crossword, words)) {
    console.log('Error');
    return 'Error';
  }
  const puzzleNumbers = parseCrossword(crossword);
  const wordsBeginnings = findWordBeginnings(puzzleNumbers);
  const wordsCount = wordsBeginnings.reduce(
    (acc, cell) => acc + puzzleNumbers[cell.row][cell.col],
    0
  );
  if (wordsCount !== words.length) {
    console.log('Error');
    return 'Error';
  }
  const puzzleWidth = puzzleNumbers[0].length;
  if (puzzleNumbers.some(row => row.length !== puzzleWidth)) {
    console.log('Error');
    return 'Error';
  }
  if (new Set(words).size !== words.length) {
    console.log('Error');
    return 'Error';
  }
  words.sort((a, b) => b.length - a.length);
  const puzzleWords = puzzleNumbers.map(row =>
    row.map(cell => (cell === -1 ? '.' : ''))
  );
  const canAddWord = (word, row, col, direction) => {
    if (direction === 'horizontal' && col + word.length > puzzleNumbers[row].length) {
      return false;
    }
    if (direction === 'vertical' && row + word.length > puzzleNumbers.length) {
      return false;
    }
    for (let i = 0; i < word.length; i++) {
      if (puzzleWords[row][col] !== '') {
        if (puzzleWords[row][col] !== word[i]) {
          return false;
        }
      }
      direction === 'horizontal' ? col++ : row++;
    }
    const afterWordCell = puzzleNumbers[row]?.[col];
    return afterWordCell === -1 || afterWordCell === undefined;
  };
  const addWords = words => {
    if (words.length === 0) {
      return true;
    }
    for (const word of words) {
      for (const cell of wordsBeginnings) {
        if (puzzleNumbers[cell.row][cell.col] === 0) continue;
        if (canAddWord(word, cell.row, cell.col, 'horizontal')) {
          const backupRow = puzzleWords[cell.row].slice();
          for (let j = 0; j < word.length; j++) {
            puzzleWords[cell.row][cell.col + j] = word[j];
          }
          puzzleNumbers[cell.row][cell.col]--;
          if (addWords(words.filter(w => w !== word))) {
            return true;
          }
          puzzleNumbers[cell.row][cell.col]++;
          puzzleWords[cell.row] = backupRow;
        }
        if (canAddWord(word, cell.row, cell.col, "horizontal")) {
          const backupRow = puzzleWords[cell.row].slice();
          for (let j = 0; j < word.length; j++) {
          puzzleWords[cell.row][cell.col + j] = word[j];
          }
          puzzleNumbers[cell.row][cell.col]--;
          if (addWords(words.filter((w) => w !== word))) {
          return true;
          }
          puzzleNumbers[cell.row][cell.col]++;
          puzzleWords[cell.row] = backupRow;
          }
    if (canAddWord(word, cell.row, cell.col, "vertical")) {
      const backupCol = puzzleWords.map((row) => row[cell.col]);
       for (let j = 0; j < word.length; j++) {
        puzzleWords[cell.row + j][cell.col] = word[j];
      }
       puzzleNumbers[cell.row][cell.col]--;
       if (addWords(words.filter((w) => w !== word))) {
        return true;
      }
       puzzleNumbers[cell.row][cell.col]++;
       puzzleWords.forEach((row, index) => (row[cell.col] = backupCol[index]));
    }
  }
}
return false;
};
if (!addWords(words)) {
console.log("Error");
return "Error";
}
const result = puzzleWords.map((row) => row.join("")).join("\n");
console.log(result);
return result;
};
const puzzle = '..1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....';
const words = [
  'sun',
  'sunglasses',
  'suncream',
  'swimming',
  'bikini',
  'beach',
  'icecream',
  'tan',
  'deckchair',
  'sand',
  'seaside',
  'sandals',
]
crosswordSolver(emptyPuzzle, words);
