import { parseItem } from '../lib/parser';
import { calculateScore } from '../lib/scoring';

self.onmessage = (e: MessageEvent) => {
    const data = e.data;

    // Handle both old (string only) and new (object with strategy) formats
    const text = typeof data === 'string' ? data : data.text;
    const strategyName = typeof data === 'string' ? undefined : data.strategyName;

    console.log('Worker: Processing text...');
    const item = parseItem(text);

    if (item) {
        console.log('Worker: Item parsed:', item.name);
        // Calculate score with strategy if provided, otherwise it defaults to Generic
        const score = calculateScore(item, strategyName);
        item.score = score;
    } else {
        console.warn('Worker: Failed to parse item or not relevant');
    }

    self.postMessage(item);
};
