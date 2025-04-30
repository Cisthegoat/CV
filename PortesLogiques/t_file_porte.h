/*
Module: T_FILE_PORTE
Description: Définit le type t_file_porte permettant de stocker une file de portes et fournit
			 l'ensemble des fonctions pour manipuler la file.
Auteur: Anis Boubaker
Dernière modification: 2018-03-19
*/

#ifndef FILE_PORTE_H_
#define FILE_PORTE_H_

#include "t_porte.h"
#include "t_circuit.h"


typedef struct t_porte t_porte;
typedef struct t_circuit t_circuit;

/*
Définit le type t_file_porte qui permet de stocker une file de (pointeurs) de portes.
*/
struct t_file_porte {
	//Tableau statique de pointeurs de portes
	t_porte *tab[CIRCUIT_MAX_PORTES];
	//Nombre maximal de pointeurs de portes pouvant être ajoutés à 
	//la file
	int taille_max;
	//Nombre d'éléments actuellement stockés dans la file
	int nb_elts;
};

typedef struct t_file_porte t_file_porte;

/*
Fonction: t_file_porte_initialiser
Description: Crée une file de pointeurs de portes (t_porte*)
Arguments:
- taille_max (entier): Le nombre maximal de portes pouvant être contenues dans
                       la file
Retour: Un pointeur vers la file créée
*/
t_file_porte *t_file_porte_initialiser(int taille_max);


/*
Fonction: t_file_porte_enfiler
Description: Ajoute un pointeur de porte à la fin de la file
Arguments:
- file: Pointeur vers la file
- nouvelle_valeur: Pointeur vers la porte à ajouter à la file
Retour: Booléen: Vrai si l'opération enfiler s'est bien effectuée
				 (file n'est pas pleine), et faux sinon.
Pré-requis: La file a déjà été initialisée.
*/
int t_file_porte_enfiler(t_file_porte *file, const t_porte *nouvelle_valeur);

/*
Fonction: t_file_porte_defiler
Description: Retourne le pointeur vers la porte en début de file, et le supprime 
			 de la file.
Arguments:
- file: Pointeur vers la file
Retour: Pointeur vers la porte défilée
Pré-requis: La file a déjà été initialisée.
*/
t_porte* t_file_porte_defiler(t_file_porte *file);


/*
Fonction: t_file_porte_est_vide
Description: Vérifie si la file est vide
Arguments:
- file: Pointeur vers la file
Retour: Vrai si la file est vide, faux sinon.
Pré-requis: La file a déjà été initialisée.
*/
int t_file_porte_est_vide(const t_file_porte* file);

/*
Fonction: t_file_porte_contient
Description: Vérifie si une porte existe dans la file (i.e. son adresse!).
Arguments:
- file : La file où l'on cheche la porte
- valeur_recherchee (pointeur de t_porte): Valeur à rechercher dans la file
Retour: Vrai si valeur_recherche existe dans la file, faux sinon.
Pré-requis: La file a déjà été initialisée.
*/
int t_file_porte_contient(const t_file_porte* file, const t_porte *valeur_recherchee);

/*
Fonction: t_file_porte_premier
Description: Retourne la valeur en tête de file, sans la supprimer de la file.
Arguments:
- file: Pointeur vers la file
Retour: Pointeur vers le premier élément de la file.
Pré-requis: La file a déjà été initialisée.
*/
t_porte* t_file_porte_premier(const t_file_porte *file);

/*
Fonction: t_file_porte_dernier
Description: Retourne la valeur en queue de file, sans la supprimer de la file.
Arguments:
- file: Pointeur vers la file
Retour: Pointeur vers la dernière porte de la file.
Pré-requis: La file a déjà été initialisée.
*/
t_porte* t_file_porte_dernier(const t_file_porte *file);


#endif