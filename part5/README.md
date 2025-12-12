1. For the playwright tests to run you need to start both front and back end.
Front end: normal start
npm run dev
Back end: need to start it in test environment:
npm run start:test

2. Different useful test commands:
2.1. Run all tests: npm test
2.2. Run all tests (only on Chrome browser): -- --project chromium
2.3. Specific test: npm test -- -g "blogs are arranged in the order according to the likes, the blog with the most likes first"
2.4. Specific test (only on Chrome browser): npm test -- -g "blogs are arranged in the order according to the likes, the blog with the most likes first" --project=chromium