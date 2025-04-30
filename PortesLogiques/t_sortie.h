/*
Module: T_SORTIE
Description: Définit le type t_sortie (sortie de circuit) et fournit les
			 fonctions pour le manipuler.
Auteur: Anis Boubaker
Dernière modification: 2018-03-19
*/


#ifndef SORTIE_H_
#define SORTIE_H_

#include "t_pin_entree.h"
#include <stdlib.h>
#include <stdio.h>

typedef struct t_pin_entree t_pin_entree;

#define NOM_SORTIE_TAILLE_MAX 10 //Taille maximale du nom
								 //de la sortie

struct t_sortie{
	int id; //Identifiant numérique de la sortie de circuit.
			//doit être unique parmi les sorties du circuit
	char *nom; //Nom de la sortie
	t_pin_entree *pin; //Pin de la sortie
};

typedef struct t_sortie t_sortie; 


/*
Fonction: T_SORTIE_INIT
Description: Crée une nouvelle sortie de circuit. Le constrcuteur reçoi un
			 identifiant numérique qui (on assume) est unique dans le circuit.

			 À partir de cet identifiant, la fonction construit le nom de la sortie.
			 Ex.: S1 est le nom de la sortie ayant pour identifiant 1.

Paramètres:
- id: Entier représentant l'identifiant numérique de la sortie (unique dans un circuit)
Retour: Pointeur vers la sortie de circuit créée
Paramètres modifié: Aucun.
*/
t_sortie *t_sortie_init(int num);

/*
Fonction: T_SORTIE_DESTROY
Description: Libère la mémoire occupée par la sortie et tous ses composants (i.e. la pin).
NDE: Ne pas oublier de détruire la pin_entrée de la sortie.
Paramètres:
- sortie: Pointeur vers la sortie à détruire.
Retour: Aucun.
*/
void t_sortie_destroy(t_sortie *sortie);

/*
Fonction: T_SORTIE_GET_PIN
Description: Accesseur - Retourne un pointeur vers la pin_entree de la sortie
			de circuit.
Paramètres:
- sortie: Pointeur vers la sortie de circuit dont on veut accéder à la pin_entree.
Retour: Pointeur vers la pin_entree de la sortie de circuit.
*/
t_pin_entree *t_sortie_get_pin(t_sortie *sortie);


/*
Fonction: T_SORTIE_RELIER
Description: Relie sortie de circuit à un autre composant du circuit (entrée ou une autre porte)
			 On note ici qu'on relie la pin_entree de la sortie vers une pin_sortie
			 d'un autre composant. Les seuls autres composants disposant de pin_sortie sont
			 les entrées du circuit et les portes. 

			 Si la sortie a déjà été reliée, le nouveau lien écrase l'ancien. 

NDE: Pour faire la liaison, la fonction t_pin_entree_relier vous sera très utile!
Paramètres:
- sortie: Pointeur vers la sortie de circuit à relier.
- source: La pin_sortie vers laquelle nous allons relier la pin_sortie de la sortie de
		  circuit. 
Retour: Booléen : Vrai si la liaison a bien été effectuée. Faux sinon. 
*/
int t_sortie_relier(t_sortie *dest, t_pin_sortie *source);

/*
Fonction: T_SORTIE_EST_RELIEE
Description: Vérifie si une sortie de circuit est reliée. Pour qu'elle soit reliée,
			sa pin_entree doit être reliée.
NDE: Il existe une fonction dans t_pin_entree qui vous permet
	 de vérifier si une pin est reliée. Utilisez-la!
Paramètres:
- sortie: Pointeur vers la sortie que l'on souhaite vérifier.
Retour: Booléen Vrai si la porte est entièrement reliée, Faux sinon.
*/
int t_sortie_est_reliee(t_sortie *sortie);

/*
Fonction: T_SORTIE_RESET
Description: Réinitialise une sortie. Pour réinitialiser une sortie, il suffit
de ré-initialiser sa pin_entree.

NDE: Il y'a une fonctions prête dans le module t_pin_entree.

Paramètres:
- sortie: Pointeur vers la sortie de circuit à réinitialiser.
Retour: Aucun
*/
void t_sortie_reset(t_sortie *sortie);

/*
Fonction: T_SORTIE_GET_VALEUR
Description: Retourne la valeur du signal de la sortie. Ceci correspond à la valeur
			 du signal de sa pin_entree.

NDE: Il y'a une fonctions prête dans le module t_pin_entree.

Paramètres:
- sortie: Pointeur vers la sortie de circuit dont on veut connaitre la valeur.
Retour: Entier: valeur du signal à la sortie
*/
int t_sortie_get_valeur(t_sortie *sortie);

#endif