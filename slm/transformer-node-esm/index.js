import { pipeline } from "@huggingface/transformers";

// See https://huggingface.co/docs/transformers.js/api/pipelines
// Blog post with GPU workers (doesn't work on Mac): https://codezen.medium.com/unleashing-the-power-of-self-learning-machines-running-slms-on-your-browser-2ed3f3a3496e

// Text classification
// const classifier = await pipeline("text-classification");
// const result = await classifier("I love Transformers.js!");
// console.log(result);
// [{ label: 'POSITIVE', score: 0.9997673034667969 }]

// Named entity recognition
// TODO Perhaps to identify sensitive information in a text before sending to LLM?
// const classifier = await pipeline('token-classification', 'Xenova/bert-base-NER');
// const output = await classifier('My name is Sarah and I live in London');
// console.log(output);
// [
//   { entity: 'B-PER', score: 0.9980202913284302, index: 4, word: 'Sarah' },
//   { entity: 'B-LOC', score: 0.9994474053382874, index: 9, word: 'London' }
// ]

// Zero-shot classification
// TODO Perhaps to suggest task list to assign to? Once model loaded, ~1s latency?
// There is another example: https://huggingface.co/docs/transformers.js/api/pipelines#pipelineszeroshotclassificationpipeline
const classifier = await pipeline('zero-shot-classification', 'Xenova/mobilebert-uncased-mnli');
const text = 'Review small language models (SLM) for privacy';
const labels = [ 'Unassigned', 'Work', 'Anywhere', 'Shopping' ];
const output = await classifier(text, labels);
console.log(output);
// {
//     sequence: 'Review small language models (SLM) for privacy',
//     labels: [ 'Work', 'Anywhere', 'Unassigned', 'Shopping' ],
//     scores: [ 0.7426347740750369, 0.12653774923678246, 0.0681149311293469, .06271254555883367]
// }