/*
Module: T_PIN_SORTIE
Description: Définit le type t_pin_sortie. Une pin_sortie est un point de connexion appartenant
			 à un élément du circuit qui émet un signal (mais n'en reçoit pas).
			 Les éléments d'un circuit ayant une pin sortie sont les portes (les sorties des portes) 
			 ainsi que les entrées du circuit.

			 Pour qu'une pin sortie émette un signal, ce signal doit être stocké dans le champs valeur. 
			 Une pin_sortie qui est inactive (pas alimentée) aura la valeur -1.

			 Une pin sortie permet de relier le composant auquel elle appartient à d'autres composants.
			 Elle doit être reliée à des "pin d'entrée" des composants auquel on souhaite se connecter.

			 Note: Contrairement à une pin d'entrée, une pin de sortie peut être reliée à plusieurs 
			 pin d'entrée : Ceci permet d'émettre le même signal à plusieurs composants.

Auteur: Anis Boubaker
Dernière modification: 2018-03-19
*/

#ifndef T_PIN_SORTIE_H_
#define T_PIN_SORTIE_H_

#define SORTIE_MAX_LIAISONS 10

#include "t_pin_entree.h"
#include "t_circuit.h"

typedef struct t_pin_entree t_pin_entree;
typedef struct t_circuit t_circuit;


//Définit le type t_pin_sortie
struct t_pin_sortie {
	int valeur; //Valeur du signal reçu par la pin entree. -1 si la pin est inactive.
	//Tableau de pointeurs vers des pin entrée auquel cette pin sortie est connectée
	t_pin_entree *liaisons[SORTIE_MAX_LIAISONS];
	//Nombre de pin entrée vers lesquels cette pin sortie est connectée.
	//Ce champs représente le nombre d'éléments effectifs du tableau liaisons.
	int nb_liaisons;
};
typedef struct t_pin_sortie t_pin_sortie;

/*
Fonction: T_PIN_SORTIE_INIT (constructeur)
Description: Crée une nouvelle pin sortie.
Paramètres: Aucun
Retour: Pointeur vers la pin sortie qui a été créée
Paramètres modifié: N/A.
*/
t_pin_sortie *t_pin_sortie_init(void);

/*
Fonction: T_PIN_SORTIE_DESTROY (Destructeur)
Description: Libère la mémoire occupée par la pin sortie.
Paramètres:
- pin: Pointeur vers la pin sortie à détruire.
Retour: Aucun.
Paramètres modifié: pin
*/
void t_pin_sortie_destroy(t_pin_sortie *pin);

/*
Fonction: T_PIN_SORTIE_GET_VALEUR (Accesseur)
Description: Accesseur du champs valeur.
Paramètres:
- pin: Pointeur vers la pin sortie.
Retour: (entier) Valeur du pin : 0, 1 ou -1.
Paramètres modifié: aucun
*/
int t_pin_sortie_get_valeur(t_pin_sortie *pin);

/*
Fonction: T_PIN_SORTIE_GET_VALEUR (Mutateur)
Description: Mutateur du champs valeur.
Paramètres:
- pin: Pointeur vers la pin sortie.
- valeur: nouvelle valeur de la pin sortie (doit obligatoirement être -1, 0 ou 1)
Retour: Aucun
Paramètres modifié: pin
*/
void t_pin_sortie_set_valeur(t_pin_sortie *pin, int valeur);

/*
Fonction: T_PIN_SORTIE_AJOUTER_LIEN
Description: Relie la pin sortie à une pin entrée. Cette fonction permet de relier le composant, auquel
			 apparatien la pin sortie, à un autre composant, auquel appartient la pin entrée.

			 La fonction doit vérifier qu'on excède le nombre maximal de liens autorisés 
			 (SORTIE_MAX_LIAISONS)
Paramètres:
- pin_sortie: La pin sortie à relier
- pin_entree: La pin entrée à laquelle la pin sortie sera reliée.
Retour: Vrai si le lien a bien été ajouté, faux sinon.
*/
int t_pin_sortie_ajouter_lien(t_pin_sortie *pin_sortie, const t_pin_entree *pin_entree);

/*
Fonction: T_PIN_SORTIE_SUPPRIMER_LIEN
Description: Supprime un lien existant entre la pin_sortie et une pin_entree passée en paramètre.
			 Si il n'existe aucun lien entre ces pins, la fonction n'aura aucun effet.

Paramètres:
- pin_sortie: La pin sortie dont on veut supprimer le lien
- pin_entree: La pin entrée vers laquelle la pin sortie est liée.
Retour: Aucun
*/
void t_pin_sortie_supprimer_lien(t_pin_sortie *pin_sortie, const t_pin_entree *pin_entree);


/*
Fonction: T_PIN_SORTIE_EST_RELIEE
Description: Permet de vérifier si une pin sortie est reliée à au moins une pin entrée.

Paramètres:
- pin_sortie: La pin sortie dont on veut vérifier la liaison
Retour: Booléen: Vrai si la pin sortie est reliée, Faux sinon.
*/
int t_pin_sortie_est_reliee(t_pin_sortie *pin);

/*
Fonction: T_PIN_SORTIE_PROPAGER_SIGNAL
Description: Fonction qui propage le signal de la pin sortie vers toutes les pin entrée 
			 avec lesquelles elle est reliée.

			 La pin ne doit pas être inactive (valeur = -1) pour que le signal puisse se 
			 propager.

Paramètres:
- pin_sortie: La pin sortie dont on veut propager le signal
Retour: Booléen: Vrai si le signal s'est bien propagé, faux sinon. Le signal ne peut se propager
	    si la pin est inactive ou si elle n'est reliée à aucune pin entrée.
*/
int t_pin_sortie_propager_signal(t_pin_sortie *pin);

/*
Fonction: T_PIN_ENTREE_RESET
Description: Ré-initialise la valeur de la pin entree
Parametre:
- pin_entree: La pin entrée dont on veut réinitialiser la valeur
Retour: Aucun.
*/
void t_pin_sortie_reset(t_pin_sortie *pin);

/*
Fonction: T_PIN_SORTIE_SERIALISER_LIENS
Description: Transforme en texte les informations de la pin sortie.
*/
void t_pin_sortie_serialiser_liens(t_pin_sortie *pin, t_circuit *circuit, char *resultat);

#endif