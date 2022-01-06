
function printPopulation(population, heading) {
    console.log(heading);
    console.log("------------------------------");

    for (let i = 0, size = population.chromosomes.length; i < size; i++) {
        let msg = "Chromosome # " + i + " : " + population.chromosomes[i].genes;
        msg = msg + " | Fitness: " + population.chromosomes[i].getFitness();
        console.log(msg);
    }
}

window.onload = function () {
    let population = new Population(GeneticAlgorithm.POPULATION_SIZE).initializePopulation();
    let geneticAlgorithm = new GeneticAlgorithm();

    let generationNumber = 0;
    console.log("------------------------------");
    console.log("Generation # " + generationNumber + " | FitTest chromosome fitness: " + population.chromosomes[0].getFitness());
    printPopulation(population, "Target Chromosome: " + GeneticAlgorithm.TARGET_CHROMOSOME);

    while (population.chromosomes[0].getFitness() < GeneticAlgorithm.TARGET_CHROMOSOME.length) {
        generationNumber++;
        console.log("------------------------------");
        population = geneticAlgorithm.evolve(population);
        population.sortChromosomeByFitness();

       console.log("Generation # " + generationNumber + " | FitTest chromosome fitness: " + population.chromosomes[0].getFitness());
        printPopulation(population, "Target Chromosome: " + GeneticAlgorithm.TARGET_CHROMOSOME);
    }
};