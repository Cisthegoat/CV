/*
Module: T_PORTE
Description: Définit le type porte et fournit les fonctions pour manipuler une porte.
Note: Ce module a été conçu de sorte à ce qu'il soit facielement extensible pour traiter
      des portes peronnalisées (i.e. des circuits qu'on réutilise comme des portes dans 
	  d'autres circuits. Pour limiter le travail des étudiants, cette fonctionnalité a été
	  abandonnée mais il n'en demeure pas moins un point d'évolution potentiel du projet. 
      Les étudiants courageux sont encouragés à considérer, voir implémenter cette évolution.
Auteur: Anis Boubaker
Dernière modification: 2018-03-19
*/

#ifndef T_PORTE_H_
#define T_PORTE_H_

#include <string.h>
#include <stdio.h>
#include "t_pin_entree.h"
#include "t_pin_sortie.h"
#include "t_circuit.h"


typedef struct t_pin_entree t_pin_entree;
typedef struct t_pin_sortie t_pin_sortie;
typedef struct t_circuit t_circuit;


#define NOM_PORTE_TAILLE_MAX 10 //Taille maximale du nom d'une porte
								//En nombre de caractères

/*
Énumération: E_TYPES_PORTES
Description: Énumère les types de portes permis 
*/
enum e_types_portes { PORTE_ET, PORTE_OU, PORTE_NOT, PORTE_XOR };
typedef enum e_types_portes e_types_portes;

/*
Définit le type t_porte qui permet de stocker l'information relative à une porte.
*/
struct t_porte {
	int id; //Identifiant numérique de la porte (doit être unique dans un circuit)
	//Nom de la porte construit automatiquement à partie de l'identifiant (ex.: P1)
	char *nom; 
	e_types_portes type; //Type de la porte (parmi les types énumérés)
	//Tab statique de pointeurs vers des pin entrée. L'ensemble des pins entrée
	//représente les entrées de la porte.
	t_pin_entree *entrees[MAX_ENTREES];
	//Pointeur vers la pin sortie de la porte.
	t_pin_sortie *sortie; 
	//Nombre d'entrées de la porte. Représente le nombre d'éléments significatifs
	//dans le tableau du champs "entrees"
	int nb_entrees; 
};

typedef struct t_porte t_porte;

/*
Fonction: T_PORTE_INIT
Description: Crée une nouvelle porte du type spécifié en paramètre. Selon le type, la 
			 fonction initialise les pin_entree et pin_sortie qui conviennent au type.

			 L'identifiant numérique reçu en paramètre doit être unique dans le circuit
			 (aucune autre porte ne doit avoir le même identifiant). À partir de cet 
			 identifiant, la fonction construit le nom de la porte. Ex.: P2 est le nom 
			 de la porte ayant pour identifiant 2.

Paramètres: 
- id: Entier représentant l'identifiant numérique de la porte (unique dans un circuit)
- type: Le type de porte à créer, selon la liste des types prédéfinis dans t_types_portes
Retour: Pointeur vers la porte créée
Paramètres modifié: Aucun.
*/
t_porte *t_porte_init(int id, e_types_portes type);
/*
Fonction: T_PORTE_DESTROY
Description: Libère la mémoire occupée par la porte et tous ses composants.
NDE: Ne pas oublier de détruire toutes les pin_entree et pin_sortie appartenant à la porte.
Paramètres:
- porte: Pointeur vers la porte à détruire.
Retour: Aucun.
*/
void t_porte_destroy(t_porte *porte);

/*
Fonction: T_PORTE_CALCULER_SORTIES
Description: Calcule la valeur des pin sorties de la porte, selon la valeur des pin_entree 
			 et le type de porte. Par exemple, si la porte est une porte ET, et que les deux
			 pin_entree de la porte ont une valeur de 1, la pin_sortie de la porte doit avoir
			 la valeur 1. 
NDE: 
- N'oubliez pas qu'il existe des opérateurs binaires en C. Utilisez-les!
- N'oubliez pas que, pour modifier la valeur d'une pin_sortie (par ex.), vous devez utiliser
  le mutateur corespondant (dans l'exemple t_pin_sortie_set_valeur) et ne pas modifier la valeur
  du champs directement (car nous sommes à l'extérieur du module t_pin_sortie).
Paramètres:
- porte: Pointeur vers la porte dont on souhaite calculer les sorties (dans cette version du 
		 programme, il n'existe qu'une seule sortie par porte).
Retour: Aucun.
*/
void t_porte_calculer_sorties(t_porte *porte);


/*
Fonction: T_PORTE_RELIER
Description: Relie une des entrées de la porte à un autre composant du circuit (entrée ou une autre porte)
			 On note ici qu'on relie une des pin_entree de la porte vers une pin_sortie
			 d'un autre composant. Les seuls autres composants disposant de pin_sortie sont
			 les entrées du circuit et les autres portes. 

			 Si l'entrée de la porte en question a déjà été reliée, l'ancien lien est remplacé
			 par le nouveau.

NDE: Pour faire la liaison, la fonction t_pin_entree_relier vous sera très utile!
Paramètres:
- porte: Pointeur vers la porte à relier.
- num_entree: l'indice de la pin_entree à relier dans le tableau des entrées. 
			  Si cet indice n'existe pas, la fonction retourne faux.  
- source: La pin_sortie vers laquelle nous allons relier l'entrée de la porte. 
Retour: Booléen : Vrai si la liaison a bien été effectuée. Faux sinon. 
*/
int t_porte_relier(t_porte *dest, int num_entree, t_pin_sortie *source);

/*
Fonction: T_PORTE_EST_RELIEE
Description: Vérifie si une porte est entièrement reliée. Pour qu'elle soit entièrement
			 reliée, ses pin d'entrées et ses pins de sortie doivent être reliées.
NDE: Il existe des fonctions dans t_pin_entree et t_pin_sortie qui vous permettent
     de vérifier si une pin est reliée. Utilisez-les!
Paramètres:
- porte: Pointeur vers la porte que l'on souhaite vérifier.
Retour: Booléen Vrai si la porte est entièrement reliée, faux sinon.
*/
int t_porte_est_reliee(t_porte *porte);

/*
Fonction: T_PORTE_RESET
Description: Réinitialise une porte. Pour réinitialiser une porte, il suffit
			 de ré-initialiser chacune de ses pin. 
			 
NDE: Encore ici, il y'a des fonctions prêtes dans les modules t_pin_entree
	 et t_pin_sortie pour ré-initialiser les pins.
Paramètres:
- porte: Pointeur vers la porte à réinitialiser.
Retour: Aucun
*/
void t_porte_reset(t_porte *porte);

/*
Fonction: T_PORTE_PROPAGER_SIGNAL
Description: Propage le signal à partir de la porte passée en paramètre.
			 Pour que le signal puisse se propager, il faut que la porte
			 ait une valeur sur chacune de ses entrées (i.e. !=-1).
			 Si c'est le cas, il suffit de calculer la sortie, puis de propager
			 le signal à partir de la pin_sortie.

NDE: Une fois que vous avez calculé la valeur de la pin sortie, utilisez 
	 la fonction t_pin_sortie_propager_signal.
Paramètres:
- porte: Pointeur vers la porte dont on veut propager le signal.
Retour: Booléen: vrai si le signal a pu se propager (i.e. toutes les entrées ont
		réçu un signal, Faux sinon.
*/
int t_porte_propager_signal(t_porte *porte);


t_pin_sortie* t_porte_get_pin_sortie(t_porte* porte);

#endif