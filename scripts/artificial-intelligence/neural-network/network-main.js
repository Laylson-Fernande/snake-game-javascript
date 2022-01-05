window.onload = function () {
    x = [[0, 1], [1, 0], [0, 0], [1, 1]];
    y = [[1,0], [0,1], [1,1], [0,0]];

    network = new Network([2, 10, 2], 0.01);
    network.fit(x, y, 100000);

    let output = [];
    input = [[0, 1], [1, 0], [0, 0], [1, 1]];
    for (i = 0; i < input.length; i++) {
        output = network.predict(input[i]);
        console.log(output.toString());
    }
};