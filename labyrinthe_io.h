/*
Module: labyrinthe_io
Description: Module de fonction d'entrée/sortie en lien avec le programme du labyrinthe

Auteur:    

Date: 
*/

#ifndef LABYRINTHE_IO_H
#define LABYRINTHE_IO_H


//Dépendances du module
#include "labyrinthe.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

//Constantes
#define TAILLE_MAX_NOM_FICHIER 100 //Taille maximale (en cracatères) du nom de fichier

/*
Fonction: CHARGER_LABYRINTHE
Description: Charge un labyrinthe depuis le disque dur et le stocke dans "grille". Si une erreur
			 se produit (fichier introuvable, fichier non-conforme), la fonction retourne faux. Sinon
			 elle retourne vrai.
Paramètres:
- nom_fichier (chaine de caractères): Le nom du fichier sur le disque à charger. Ça doit être un fichier
										 texte comprenant uniquement des * (pour les murs), des espaces (pour
										 les couloirs et une lettre E pour représenter l'entrée.
- grille: (tableau 2D d'entiers): Tableau qui contiendra la topologie de la grille. Chaque case aura soit la
								  valeur 0 (pour un couloir) soit 1 (pour un mur).
- point_entree: (tableau de deux cases) Tableau dans lequel seront stockées les coordonnées du point d'entrée.
- hauteur_grille: (pointeur d'entier) Adresse dans laquelle sera stockée la hauteur de la grille (nombre de lignes)
- largeur_grille: (pointeur d'entier) Adresse dans laquelle sera stockée la largeur de la grille (nombre de colonnes)
Retour : (valeur booléenne) Vrai si la grille s’est chargée correctement, faux sinon.
Paramètres modifiés : grille, point_entree, *hauteur_grille et *largeur_grille.
*/
int charger_labyrinthe(char* nom_fichier,int grille[][TAILLE_MAX_GRILLE],int point_entree[2],int* hauteur_grille,int* largeur_grille);
/*
Fonction: SELECTION_MENU
        Description: Affiche le menu principal et demande à l'utilisateur de saisir un choix.
La fonction indique si certains choix sont indisponibles: il n'est pas possible
de résoudre le labyrinthe si aucun labyrinthe n'a été chargé depuis le disque.
La fonction vérifie si le choix est invalide(ex.: erronné ou non disponible)
Une fois qu'un choix valide aura été effectué, la fonction retourne le choix en
question.
Paramètres:
- grille_chargee (entier): valeur booléenne: vrai si la grille a déjà été chargée, faux sinon.
Retour: (entier) Valeur du choix valide saisi par l'usager.
Paramètres modifiés: Aucun.
*/
int selection_menu(int grille_chargee);

/*
Fonction: MENU_CHARGER_LABYRINTHE
Description: Demande à l'usager de saisir un nom de fichier correspondant au fichier contenant
 le labyrinthe à charger.
Paramètres:
- buf_nom_fichier (chaine de caractères): chaine de caractères dans laquelle sera stockée le nom du
 fichier saisi.
- buf_taille (entier): Taille maximale de la chaine de caractère à lire depuis la console.
Retour: Aucun.
Paramètres modifiés: buf_nom_fichier.
*/
void menu_charger_labyrinthe(char* buf_nom_fichier, int buf_taille);


#endif // !LABYRINTHE_IO_H