const assert = require('assert');
const {calRetentions} = require("./utils1");

function test_calRetentions() {
    // Test case 1: No common ranges
    assert.deepStrictEqual(calRetentions([[1,2],[4,5]],[[3,4],[6,7]]), [[4,4]]);
    console.log("Passed");

    // Test case 2: One common range
    assert.deepStrictEqual(calRetentions([[1,2],[4,5]],[[2,4],[6,7]]), [[2,2],[4,4]]);
    console.log("Passed");

    // Test case 3: Multiple common ranges
    assert.deepStrictEqual(calRetentions([[0,2],[4,5],[8,10]],[[1,4],[7,8]]), [[1,2],[4,4],[8,8]]);
    console.log("Passed");

    // Test case 4: One array empty
    assert.deepStrictEqual(calRetentions([[0,2],[4,5],[8,10]],[]), []);
    console.log("Passed");

    // Test case 5: Both arrays empty
    assert.deepStrictEqual(calRetentions([],[]), []);
    console.log("Passed");


    // Test case 9: Overlapping ranges
    assert.deepStrictEqual(calRetentions([[0,1],[2,3]],[[1,2]]), [[1,2]]);
    console.log("Passed");

    // Test case 10: One array having duplicate ranges
    assert.deepStrictEqual(calRetentions([[0,6]],[[1,3],[5,6]]), [[1,3],[5,6]]);
    console.log("Passed");

    // Test case 12: Large ranges and arrays
    assert.deepStrictEqual(calRetentions([[1000000,1000002],[1000004,1000006]],[[1000001,1000003],[1000005,1000007]]), [[1000001,1000002],[1000005,1000006]]);
    console.log("Passed");

}

// Run the test cases
test_calRetentions();
