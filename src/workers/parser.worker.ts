import { parseItem } from '../lib/parser';
import { calculateScore } from '../lib/scoring';

self.onmessage = (e: MessageEvent) => {
    const text = e.data;
    console.log('Worker: Processing text...');
    const item = parseItem(text);

    if (item) {
        console.log('Worker: Item parsed:', item.name);
        const score = calculateScore(item);
        item.score = score;
    } else {
        console.warn('Worker: Failed to parse item or not relevant');
    }

    self.postMessage(item);
};
