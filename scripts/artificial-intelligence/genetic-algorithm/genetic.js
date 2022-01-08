class GeneticAlgorithm {

    evolve(population) {
        population = this.crossoverPopulation(population);
        population = this.mutatePopulation(population);
        return population;
    }

    crossoverPopulation(population) {
        let _crossoverPopulation = new Population(population.chromosomes.length);
        for (let i = 0; i < TrainingManager.NUMBER_ELITE_CHROMOSOMES; i++) {
            _crossoverPopulation.chromosomes[i] = population.chromosomes[i];
        }
        for (let i = TrainingManager.NUMBER_ELITE_CHROMOSOMES, size = population.chromosomes.length; i < size; i++) {
            let a = this.selectTournamentPopulation(population).chromosomes[0];
            let b = this.selectTournamentPopulation(population).chromosomes[0];
            _crossoverPopulation.chromosomes[i] = this.crossoverChromosome(a, b);
        }
        return _crossoverPopulation;
    }

    mutatePopulation(population) {
        let mutatePopulation = new Population(population.chromosomes.length);
        for (let i = 0; i < TrainingManager.NUMBER_ELITE_CHROMOSOMES; i++) {
            mutatePopulation.chromosomes[i] = population.chromosomes[i];
        }

        for (let i = TrainingManager.NUMBER_ELITE_CHROMOSOMES, size = population.chromosomes.length; i < size; i++) {
            mutatePopulation.chromosomes[i] = this.mutateChromosome(population.chromosomes[i]);
        }
        return mutatePopulation;
    }

    crossoverChromosome(a, b) {
        let crossoverChromosome = new SnakeTrainer(true);
        for (let i = 0, size = a.genes.length; i < size; i++) {
            if (Math.random() < 0.5) {
                crossoverChromosome.genes[i] = a.genes[i];
            } else {
                crossoverChromosome.genes[i] = b.genes[i];
            }
        }
        return crossoverChromosome;
    }

    mutateChromosome(chromosome) {
        let mutateChromosome = new SnakeTrainer(true);
        for (let i = 0, size = chromosome.genes.length; i < size; i++) {
            if (Math.random() < TrainingManager.MUTATION_RATE) {
                if (Math.random() < 0.5) {
                    mutateChromosome.genes[i] = 1;
                } else {
                    mutateChromosome.genes[i] = 0;
                }
            } else {
                mutateChromosome.genes[i] = chromosome.genes[i];
            }
        }
        return mutateChromosome;
    }

    selectTournamentPopulation(population) {
        let tournamentPopulation = new Population(TrainingManager.TOURNAMENT_SELECTION_SIZE);
        let sizeChromosomes = population.chromosomes.length;
        for (let i = 0; i < TrainingManager.TOURNAMENT_SELECTION_SIZE; i++) {
            let index = Math.floor(Math.random() * sizeChromosomes);
            tournamentPopulation.chromosomes[i] = population.chromosomes[index];
        }
        tournamentPopulation.sortChromosomeByFitness();
        return tournamentPopulation;
    }
}