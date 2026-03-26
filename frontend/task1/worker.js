self.onmessage = (e) => {
  const text = e.data.toLowerCase();

  const words = text.match(/[a-z]+/g);

  if (!words) {
    self.postMessage({ error: "Invalid content" });
    return;
  }

  const map = {};

  words.forEach(word => {
    map[word] = (map[word] || 0) + 1;
  });

  const uniqueCount = Object.keys(map).length;

  if (uniqueCount < 3) {
    self.postMessage({ error: "Less than 3 unique words" });
    return;
  }

  const top3 = Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  self.postMessage({
    uniqueCount,
    top3
  });
};