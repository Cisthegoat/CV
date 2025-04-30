/*
Module: T_PIN_ENTREE
Description: Définit le type t_pin_entree. Une pin_entree est un point de connexion appartenant 
		     à un élément du circuit qui reçoit un signal (mais n'en émet pas). 
			 Les éléments d'un circuit ayant une pin d'entrée de signal sont les portes (les entrées
			 des portes) ainsi que les sorties du circuit.

			 Si une pin entrée reçoit un signal, ce signal est stocké dans le champs valeur. Une 
			 pin_entree qui est inactive (pas alimentée) a la valeur -1. 

			 Une pin d'entree permet de relier le composant auquel elle appartient à un autre composant. 
			 Elle doit être reliée à une "pin de sortie" du composant auquel on souhaite se connecter.

Auteur: Anis Boubaker
Dernière modification: 2018-03-19
*/

#ifndef T_PIN_ENTREE_H_
#define T_PIN_ENTREE_H_

#include <stdlib.h>
#include "t_pin_sortie.h"

typedef struct t_pin_sortie t_pin_sortie;

//Définit le type t_pin_entree
struct t_pin_entree {
	int valeur; //Valeur du signal reçu par la pin entree. -1 si la pin est inactive.
	t_pin_sortie *liaison; //Pointeur vers la pin sortie
								  //à laquelle cette pin est reliée
};

typedef struct t_pin_entree t_pin_entree;

/*
Fonction: T_PIN_ENTREE_INIT (constructeur)
Description: Crée une nouvelle pin entrée.
Paramètres: Aucun
Retour: Pointeur vers la pin entrée qui a été créée
Paramètres modifié: N/A.
*/
t_pin_entree *t_pin_entree_init();

/*
Fonction: T_PIN_ENTREE_DESTROY (Destructeur)
Description: Libère la mémoire occupée par la pin entree.
Paramètres:
- pin: Pointeur vers la pin entrée à détruire.
Retour: Aucun.
Paramètres modifié: pin
*/
void t_pin_entree_destroy(t_pin_entree *pin);

/*
Fonction: T_PIN_ENTREE_GET_VALEUR (Accesseur)
Description: Accesseur du champs valeur.
Paramètres:
- pin: Pointeur vers la pin entrée.
Retour: (entier) Valeur du pin : 0, 1 ou -1.
Paramètres modifié: aucun
*/
int t_pin_entree_get_valeur(const t_pin_entree *pin);

/*
Fonction: T_PIN_ENTREE_GET_VALEUR (Mutateur)
Description: Mutateur du champs valeur.
Paramètres:
- pin: Pointeur vers la pin entrée.
- valeur: nouvelle valeur de la pin entrée (doit obligatoirement être -1, 0 ou 1)
Retour: Aucun
Paramètres modifié: pin
*/
void t_pin_entree_set_valeur(t_pin_entree *pin, int valeur);

/*
Fonction: T_PIN_ENTREE_RELIER
Description: Relie la pin entrée à une pin sortie. Cette fonction permet de relier le composant, auquel 
			 apparatien la pin entrée, à un autre composant, auquel appartient la pin sortie.

			 Cette fonction s'assure que la relation est bi-directionnelle: la pin sortie aura la pin entrée
			 comme une des pins auxquelles elle est reliee (fait en utilisant la fontion t_pin_sortie_ajouter_lien)
Paramètres:
- pin_entree: La pin entrée à relier
- pin_sortie: La pin sortie à laquelle la pin entrée sera reliée.
Retour: Aucun
*/
void t_pin_entree_relier(t_pin_entree *pin_entree,t_pin_sortie *pin_sortie);


/*
Fonction: T_PIN_ENTREE_EST_RELIEE
Description: Permet de vérifier si une pin entrée est reliée à une pin sortie.

Paramètres:
- pin_entree: La pin entrée dont on veut vérifier la liaison
Retour: Booléen: Vrai si la pin entrée est reliée, Faux sinon.
*/
int t_pin_entree_est_reliee(t_pin_entree *pin);

/*
Fonction: T_PIN_ENTREE_RESET
Description: Ré-initialise la valeur de la pin entree
Parametre: 
- pin_entree: La pin entrée dont on veut réinitialiser la valeur
Retour: Aucun.
*/
void t_pin_entree_reset(t_pin_entree *pin);


#endif