/*
Module: labyrinthe
Description: Fournit l'ensemble de fonction permettant de résoudre un labyrinthe

Auteur: 


Date: 
*/

#ifndef LABYRINTHE_H
#define LABYRINTHE_H

/*** CONSTANTES ***/
#define TAILLE_MAX_GRILLE 100 //Taille maximale en lignes et colonnes d'une grille de labyrinthe
#include "Utilitaires.h"
#include <time.h>
#include <stdlib.h>
#include <stdio.h>
#include "pile.h"
//METTRE DES commentaires


/*
Fonction: LAB_AFFICHER_GRILLE
Description: Affiche la grille du labyrinthe dans la console. La fonction doit parcourir
la grille et afficher des murs ou? la grille contient un 1, et un espace ou? il n’y en a pas. Pour afficher un mur, on utilise le caracte?re ayant pour code
ASCII 219.
Si une solution est fournie (pile_solution != NULL), on doit identifier, sur
la grille affiche?e, toutes les cases faisant partie de la solution (ex. par des X).
Parame?tres:
- grille: tableau a? deux dimensions d'entiers qui contient les informations
de la structure du labyrinthe (1=mur, 0=couloir).
- hauteur_grille : entier qui contient le nombre de lignes de la grille.
- largeur_grille : entier qui contient le nombre de colonnes de la grille.
- pile_solution : (tableau 2D) pile de coordonne?es contenant la solution (partielle ou comple?te) du
Retour: Aucun.
Parame?tre modifie?s: Aucun. */
void lab_afficher_grille(int grille[][TAILLE_MAX_GRILLE],int hauteur_grille,int largeur_grille,int pile_solution[][2]);


/*
Fonction: LAB_CALCULER_DEPLACEMENTS_POSSIBLES
Description:
Parame?tres:
- grille: tableau a? deux dimensions d'entiers qui contient les informations
de la grille.
- hauteur_grille : entier qui contient le nombre de lignes de la grille.
- largeur_grille : entier qui contient le nombre de colonnes de la grille.
- pos_ligne: la ligne de la grille sur laquelle nous sommes pre?sentement positionne?s.
- pos_colonne: la colonne de la grille sur laquele nous sommes pre?sentement positionne?s. - solution_partielle: pile de coordonne?es qui comprend les coordonne?es de la solution en
cours d'e?laboration.
- nb_deplacements : adresse ou? stocker le nombre de de?placements possible trouve?s.
- deplacements: tableau d'entiers (taille 4x2) qui contiendra le re?sultats: les coordonne?es des cases ou? un de?placement est possible depuis la position actuelle
De?termine la liste de de?placements possibles depuis une position
donne?e. Un de?placement vers une case X est possible depuis la position P si:
- X
- P
- X
pas
n’est pas un mur
et X sont deux cases adjacentes
ne fait pas partie de la solution partielle en cours d'e?laboration (pour ne revenir en arrie?re).
(max 4 possibilite?s).
Parame?tres modifie?s : nb_deplacement, deplacements.
Retour : Aucun
*/
void lab_calculer_deplacements_possibles(int grille[][TAILLE_MAX_GRILLE],int hauteur_grille,int largeur_grille,int pos_ligne,int pos_colonne,int solution_partielle[][2],int* nb_deplacements,int deplacement[4][2]);

/*
Fonction: LAB_CHOISIR_DEPLACEMENT
Description: Choisit un de?placement parmi les de?placements possibles passe?s en parame?tre.
Dans cette version, le choix du de?placement se fait de fac?on ale?atoire parmi les
de?placement possibles. Cependant, si nous souhaitons faire e?voluer notre programme
et choisir le prochain de?placement en utilisant une autre approche, il suffit de changer cette fonction.
Parame?tres:
- deplacements_possibles: tableau 2D contenant les coordonne?es des de?placements possibles. Les
donne?es de ce tableau devraient e?tre celles qui ont e?te? obtenues par
la fonction lab_calculer_deplacements_possibles.
- nb_deplacements_possibles: Nombre d'e?le?lements dans le tableau deplacements_possibles.
Retour : (Entier) indice, dans le tableau deplacements_possibles qui a e?te? choisi comme prochain de?placement.
Parame?tres modifie?s : Aucun.
 */

int lab_choisir_deplacement(int deplacements_possibles[4][2],int nb_deplacements_possibles);

/*
Fonction: LAB_EST_CASES_ADJACENTES
Description: Renvoie Vrai si les deux cases case1 et case2 sont adjacentes, et faux sinon. Deux cases
sont adjacentes si elles sont colle?es l’une a? l’autre dans la grille. Ex.: les cases (5,3) et (5,4) sont adjacentes.
Parame?tres:
- case1: (tableau de deux entiers) coordonne?es de la premie?re case.
- case1: (tableau de deux entiers) coordonne?es de la seconde case.
Retour: (Entier) Valeur vraie si les deux cases sont adjacentes, faux sinon. Parame?tres modifie?s: Aucun.
*/
int lab_est_cases_adjacentes(int case1[],int case2[]);


/*
Fonction: LAB_EST_UNE_SORTIE
Description: Fonction qui renvoie Vrai si "position" est une sortie de la grille, sinon elle
renvoie Faux. "position" est une sortie si elle se trouve en pe?riphe?rie de la grille et que ce n'est pas un mur.
Parame?tres:
- position: (tableau de deux entiers) coordonne?es de la case du labyrinthe que nous souhaitons
ve?rifier si c'est une sortie.
- grille: (tableau 2D d'entiers) Tableau qui contient la structure du labyrinthe. - hauteur_grille : entier qui contient le nombre de lignes de la grille.
- largeur_grille : entier qui contient le nombre de colonnes de la grille. Retour: (Entier) Valeur vraie si "position" est une sortie, faux sinon.
Parame?tre modifie?s: Aucun.
*/
int lab_est_une_sortie(int position[2],int grille[][TAILLE_MAX_GRILLE],int hauteur_grille,int largeur_grille);


/*
Fonction: LAB_RESOUDRE_PROFONDEUR
Description: Fonction principale du module qui a pour objectif de re?soudre le labyrinthe
en utilisant l'algorithme de parcours en profondeur (de?crit en de?tail a? la page 11 de l’e?nonce?). La fonction construit
une solution du labyrinthe "grille" dans "pile_solution".
Cette fonction peut e?tre exe?cute?e en mode "debug", auquel cas, la fonction affiche a? l'e?cran la grille avec une solution partielle a? chaque fois qu'une case est ajoute?e a? la solution.
La fonction retourne une valeur vraie si une solution a e?te? trouve?e, ou une valeur fausse sinon.
Parame?tres:
- grille: tableau a? deux dimensions d'entiers qui contient les informations
de la structure du labyrinthe.
- hauteur_grille : entier qui contient le nombre de lignes de la grille.
- largeur_grille : entier qui contient le nombre de colonnes de la grille.
- entree : (tableau de 2 entiers) coordonne?es du point d'entre?e dans le labyrinthe
- pile_solution : (tableau 2D) pile de coordonne?es. La pile doit avoir e?te? initialise?e
avant d'appeler cette fonction. Les coordonne?es de la solution seront
empile?es dans cette pile.
- debug : (entier) valeur boole?enne. Si sa valeur est Vraie, la fonction affichera la grille
au fur et a? mesure qu'on ajoute des cases a? la solution.
Retour: (Entier) Valeur vraie si une solution a e?te? trouve?e, ou fausse sinon. Parame?tre modifie?s: pile_solution.
*/
int lab_resoudre_profondeur(int grille[][TAILLE_MAX_GRILLE],int hauteur_grille,int largeur_grille,int entree[2],int pile_solution[][2],int debug);

#endif