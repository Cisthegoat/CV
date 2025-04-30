/*
Titre: File
Description: Programme qui implémente les fonctions d'une file
sur tableau statique.

Auteur: Anis Boubaker
Date: 2018-03-18
*/

/***********COMMANDES PRÉPROCESSEUR*************/
#define _CRT_SECURE_NO_WARNINGS
#include <stdlib.h>
#include <stdio.h>
#include <limits.h>
#include "t_file_porte.h"

/***********CONSTANTES DE COMPILATION*************/


/********* DÉFINITION DES FONCTION **************/
t_file_porte * t_file_porte_initialiser(const int taille_max)
{
	t_file_porte *nouv_file = (t_file_porte*)malloc(sizeof(t_file_porte));
	nouv_file->taille_max = taille_max;
	nouv_file->nb_elts = 0;


	return nouv_file;
}

int t_file_porte_enfiler(t_file_porte *file, const t_porte *nouvelle_valeur)
{
	if (file->nb_elts >= file->taille_max)
	{

		return 0;
	}

	file->tab[file->nb_elts++] = (t_porte*)nouvelle_valeur;

	return 1;
}


t_porte* t_file_porte_defiler(t_file_porte *file)
{
	t_porte* valeur_a_retourner;
	int i; //compteur de boucle

	if (file->nb_elts<=0)
	{

		return NULL;
	}

	valeur_a_retourner = file->tab[0];
	for (i = 1; i <= file->nb_elts ; i++) {
		file->tab[i - 1] = file->tab[i];

	}
	file->nb_elts--;

	return valeur_a_retourner;
}


int t_file_porte_est_vide(const t_file_porte* file)
{

	return file->nb_elts == 0;
}


int t_file_porte_contient(const t_file_porte* file, const t_porte *valeur_recherchee) {
	int i; //Compteur de boucle 
	for (i = 0; i < file->nb_elts; i++)
	{
		if (file->tab[i] == valeur_recherchee)
		{ //La valeur a été trouvée -> On retourne vrai

			return 1;
		}
	}
	//Tout le tableau a été parcouru et on n'a pas trouvé la
	//valeur --> On renvoie faux.

	return 0;
}

t_porte* t_file_porte_premier(const t_file_porte *file)
{
	if (t_file_porte_est_vide(file))
	{

		return NULL;
	}

	return file->tab[0];
}


t_porte* t_file_porte_dernier(const t_file_porte *file)
{
	if (t_file_porte_est_vide(file))
	{

		return NULL;
	}

	return file->tab[file->nb_elts-1];
}