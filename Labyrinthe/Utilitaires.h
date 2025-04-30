//
// Created by cedri on 2023-11-07.
//

#ifndef TEST_UTILITAIRES_H
#define TEST_UTILITAIRES_H
#include "time.h"
#include <stdlib.h>
#include <stdio.h>

//Fonction: calculer les deplacement aléatoire
int nb_aleatoire(int min, int max);


//Fonction: Test pour voir si la fonction lab_calculer_deplacmeents_possibles, fonctionne correctement
//
void test_calculer_deplacements_possibles(void);



//Fonction: Test pour resoudre le labyrinthe en profondeur et pas-a-pas
//
//
void Executable_labyrinthe(void);

#endif //TEST_UTILITAIRES_H
