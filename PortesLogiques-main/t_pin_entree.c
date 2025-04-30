#include "t_pin_entree.h"

t_pin_entree *t_pin_entree_init()
{
	t_pin_entree *nouv_pin;

	nouv_pin = (t_pin_entree*)malloc(sizeof(t_pin_entree));
	nouv_pin->valeur = -1;
	nouv_pin->liaison = NULL;

	return nouv_pin;
}

int t_pin_entree_get_valeur(const t_pin_entree * pin)
{
	return pin->valeur;
}

void t_pin_entree_set_valeur(t_pin_entree * pin, int valeur)
{
	if (valeur <-1 || valeur > 1) {
		//Valeur erronée
		return;
	}
	pin->valeur = valeur;
}

void t_pin_entree_relier(t_pin_entree * pin_entree, t_pin_sortie * pin_sortie)
{
	//On vérifie d'abord si on avait un lien existant
	if (pin_entree->liaison != NULL) {
		//On supprime la liaison de la pin sortie à laquelle
		//on est présentement liés
		t_pin_sortie_supprimer_lien(pin_entree->liaison, pin_entree);
	}
	pin_entree->liaison = (t_pin_sortie*)pin_sortie;
	t_pin_sortie_ajouter_lien(pin_sortie, pin_entree);
}

int t_pin_entree_est_reliee(t_pin_entree * pin)
{
	return pin->liaison != NULL;
}

void t_pin_entree_reset(t_pin_entree * pin)
{
	pin->valeur = -1;
}

void t_pin_entree_destroy(t_pin_entree * pin)
{
	free(pin);
}
