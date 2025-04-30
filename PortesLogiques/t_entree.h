/*
Module: T_ENTREE
Description: Définit le type t_entree (Entrée de circuit) et fournit les 
			 fonctions pour le manipuler.
Auteur: Anis Boubaker
Dernière modification: 2018-03-19
*/

#ifndef ENTREE_H_
#define ENTREE_H_

#include "t_pin_sortie.h"

#define NOM_ENTREE_TAILLE_MAX 10 //Taille maximale du nom
								 //de l'entrée


typedef struct t_pin_sortie t_pin_sortie;

struct t_entree{
	int id; //Identifiant numérique de l'entrée
			//doit être unique parmi les entrées 
			//du circuit
	char *nom; //Nom de l'entrée
	t_pin_sortie *pin; //Pin de sortie
} ;

typedef struct t_entree t_entree;

/*
Fonction: T_ENTREE_INIT
Description: Crée une nouvelle entrée de circuit. Le constrcuteur reçoit un 
			 identifiant numérique qui (on assume) est unique dans le circuit.

			 À partir de cet identifiant, la fonction construit le nom de l'entrée. 
			 Ex.: E1 est le nom de l'entrée ayant pour identifiant 1.

Paramètres:
- id: Entier représentant l'identifiant numérique de l'entrée (unique dans un circuit)
Retour: Pointeur vers l'entrée de circuit créée
Paramètres modifié: Aucun.
*/
t_entree *t_entree_init(int num);

/*
Fonction: T_ENTREE_DESTROY
Description: Libère la mémoire occupée par l'entrée et tous ses composants (i.e. la pin).
NDE: Ne pas oublier de détruire la pin_sortie de l'entrée.
Paramètres:
- entree: Pointeur vers l'entrée à détruire.
Retour: Aucun.
*/
void t_entree_destroy(t_entree *entree);

/*
Fonction: T_ENTREE_GET_PIN
Description: Accesseur - Retourne un pointeur vers la pin_sortie de l'entrée
Paramètres:
- entree: Pointeur vers l'entrée de circuit dont on veut accéder à la pin_sortie.
Retour: Pointeur vers la pin_sortie de l'entrée.
*/
t_pin_sortie *t_entree_get_pin(t_entree *entree);

/*
Fonction: T_ENTREE_EST_RELIEE
Description: Vérifie si une entrée de circuit est reliée. Pour qu'elle soit reliée,
			sa pin de sortie doit être reliée.
NDE: Il existe des fonctions dans t_pin_sortie qui vous permet
	 de vérifier si une pin est reliée. Utilisez-la!
Paramètres:
- entree: Pointeur vers l'entrée que l'on souhaite vérifier.
Retour: Booléen Vrai si la porte est entièrement reliée, faux sinon.
*/
int t_entree_est_reliee(t_entree *entree);

/*
Fonction: T_ENTREE_RESET
Description: Réinitialise une entrée. Pour réinitialiser une entrée, il suffit
			 de ré-initialiser sa pin_sortie.

NDE: Il y'a une fonctions prête dans le module t_pin_sortie.

Paramètres:
- entree: Pointeur vers l'entrée de circuit à réinitialiser.
Retour: Aucun
*/
void t_entree_reset(t_entree *entree);

/*
Fonction: T_ENTREE_PROPAGER_SIGNAL
Description: Propage le signal à partir de l'entrée de circuit passée en paramètre.
			 Pour que le signal puisse se propager, il faut que la pin_sortie de
			 l'entrée ait une valeur (i.e. !=-1).

NDE: Utilisez la fonction t_pin_sortie_propager_signal.
Paramètres:
- entrée: Pointeur vers l'entrée de circuit dont on veut propager le signal.
Retour: Booléen: vrai si le signal a pu se propager (i.e. la pin_sortie a une
		valeur), Faux sinon.
*/
int t_entree_propager_signal(t_entree *entree);

/*
Fonction: T_ENTREE_GET_VALEUR
Description: Retourne la valeur du signal de l'entrée. Ceci correspond à la valeur
			du signal de sa pin_sortie.

Paramètres:
- entree: Pointeur vers l'entrée de circuit dont on veut connaitre la valeur.
Retour: Entier: valeur du signal à l'entrée du circuit. 
*/
int t_entree_get_valeur(t_entree *entree);

#endif