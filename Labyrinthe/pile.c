/*
Titre: pile.c
Description: Implémentation des fonctions du module pile

Auteur: Anis Boubaker
Date: 2017-02-01
*/

/***********COMMANDES PRÉPROCESSEUR*************/
#include <stdlib.h>
#include "pile.h"

/***********CONSTANTES DE COMPILATION*************/


/********* DÉFINITION DES FONCTION **************/

int pile_empiler(int pile[][2], int new_ligne, int new_colonne)
{
	int top_pile = pile[0][1];
	int taille_max_pile = pile[0][0];

	//Vérifie que la pile peut encore recevoir des valeurs.
	if (top_pile + 1 >= taille_max_pile) {
		return 0;
	}

	pile[top_pile + 1][0] = new_ligne;
	pile[top_pile + 1][1] = new_colonne;
	pile[0][1]++;

	return 1;
}

int pile_depiler(int pile[][2], int* ligne, int* colonne)
{
	if (!pile_est_vide(pile))
	{
		pile[0][1]--;
	}
	else
	{
		return 0;
	}
	*ligne = pile[pile[0][1] + 1][0];
	*colonne = pile[pile[0][1] + 1][1];

	return 1;
}

int pile_est_vide(int pile[][2])
{
	return pile[0][1] == 0;
}

int pile_contient(int pile[][2], int ligne, int colonne)
{
	int top_pile = pile[0][1];
	int i = 0;
	for (i = 0; i < top_pile; i++)
	{
		if (pile[i + 1][0] == ligne && pile[i + 1][1] == colonne)
		{
			return 1;
		}
	}
	return 0;
}

int pile_taille_pile(int pile[][2]) {
	return pile[0][1];
}

void pile_initialiser(int pile[][2], int taille_max) {
	pile[0][0] = taille_max;
	pile[0][1] = 0;
}

void pile_haut_pile(int pile[][2], int* ligne, int* colonne)
{
	if (!pile_est_vide(pile))
	{
		*ligne = pile[pile[0][1]][0];
		*colonne = pile[pile[0][1]][1];
	}
}

void pile_copier(int pile_originale[][2], int pile_copie[][2]) {
	int i;
	for (i = 0; i < pile_originale[0][1] + 1; i++) {
		pile_copie[i][0] = pile_originale[i][0];
		pile_copie[i][1] = pile_originale[i][1];
	}
}