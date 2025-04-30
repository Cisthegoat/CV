#define _CRT_SECURE_NO_WARNINGS
#include "t_pin_sortie.h"

t_pin_sortie *t_pin_sortie_init(void)
{
	t_pin_sortie *nouv_pin;

	nouv_pin = (t_pin_sortie*)malloc(sizeof(t_pin_sortie));
	nouv_pin->valeur = -1;
	nouv_pin->nb_liaisons = 0;

	return nouv_pin;
}

void t_pin_sortie_destroy(t_pin_sortie * pin)
{
	free(pin);
}


int t_pin_sortie_get_valeur(t_pin_sortie * pin)
{
	return pin->valeur;
}

void t_pin_sortie_set_valeur(t_pin_sortie *pin, int valeur)
{
	if (valeur < -1 || valeur > 1) {
		//Valeur erronée
		return;
	}
	pin->valeur = valeur;
}

int t_pin_sortie_ajouter_lien(t_pin_sortie *pin_sortie, const t_pin_entree *pin_entree)
{
	if (pin_sortie->nb_liaisons >= SORTIE_MAX_LIAISONS) {
		return 0;
	}

	pin_sortie->liaisons[pin_sortie->nb_liaisons] = (t_pin_entree *)pin_entree;
	pin_sortie->nb_liaisons++;
	
	return 1;
}

void t_pin_sortie_supprimer_lien(t_pin_sortie * pin_sortie, const t_pin_entree * pin_entree)
{
	int i = 0;
	int	j ; //Compteurs de boucle

	//On cherche l'indice du lien existant.
	while (i < pin_sortie->nb_liaisons && pin_sortie->liaisons[i] != pin_entree)
	{
		i++;
	}

	if (i == pin_sortie->nb_liaisons) { //Le lien n'a pas été trouvé

		return;
	}

	//On décale toutes les liaisons après i
	for (j = i + 1; j < pin_sortie->nb_liaisons; i++) {
		pin_sortie->liaisons[j - 1] = pin_sortie->liaisons[j];
	}

	pin_sortie->nb_liaisons--;
}

int t_pin_sortie_est_reliee(t_pin_sortie * pin)
{
	return pin->nb_liaisons!=0;
}

int t_pin_sortie_propager_signal(t_pin_sortie * pin)
{
	int i = 0;

	if (pin->valeur == -1) {
		return 0;
	}

	if (!pin->nb_liaisons) {
		return 0;
	}

	for (i = 0; i < pin->nb_liaisons; i++) {
		t_pin_entree_set_valeur(pin->liaisons[i], pin->valeur);
	}

	return 1;
}

void t_pin_sortie_reset(t_pin_sortie * pin)
{
	pin->valeur = -1;
}

void t_pin_sortie_serialiser_liens(t_pin_sortie * pin, t_circuit * circuit, char* resultat)
{
	//int i, j, k ; //Compteurs de boucle
	//const int nb_portes = circuit->nb_portes; //Le nombre de portes du circuit
	//const int nb_sorties = circuit->nb_sorties; //Le nombre de sorties du circuit
	//const t_porte **tab_portes = t_circuit_get_portes(circuit); //Tableau de portes du circuit
	//const t_sortie **tab_sorties_circuit = t_circuit_get_sorties(circuit); //Tableau de sorties du circuit

	//t_pin_entree **entrees_porte; //Stocke le tableau d'entr�es d'une
	//							  //porte
	//t_pin_entree *entree; //Temporaire, stocke la pin_entree trait�e
	//					  //actuellement, avec qui la pin_sortie a une
	//					  //liaison.
	//
	////Initialisation du r�sultat � la chaine vive
	//resultat[0] = '\0';

	////On parcourt toutes les liaisons de la pin � la recherche
	////du composant (porte ou sortie de circuit) auquel elle peut-�tre 
	////reli�e. 
	////Tout ceci aurait pu �tre �vit� si la pin_entree ou la pin_sortie avait
	////un lien vers son composant. Cependant, ceci aurait compliqu� la conception
	////pour les �tudiants et �a a �t� abandonn� � la faveur d'une fonction de d�couverte
	////des liens plus complexe et moins efficace, mais qui leur est fournie. 
	//for (i = 0; i < pin->nb_liaisons; i++)
	//{
	//	//V�rification des liens avec les portes
	//	for (j = 0; j < nb_portes; j++) 
	//	{
	//		entrees_porte = t_porte_get_pin_entrees(tab_portes[j]);
	//		for (k = 0; k < t_porte_get_nb_entrees(tab_portes[j]); k++)
	//		{
	//			if (entrees_porte[k] == pin->liaisons[i]) 
	//			{
	//				strcat(resultat, t_porte_get_nom(tab_portes[j]));
	//				strcat(resultat, ",");
	//			}
	//		}
	//	}

	//	//V�rification des liens avec les sorties
	//	for (j = 0; j < nb_sorties; j++)
	//	{
	//		entree = t_sortie_get_pin(tab_sorties_circuit[j]);

	//		if (entree == pin->liaisons[i])
	//		{
	//			strcat(resultat, t_sortie_get_nom(tab_sorties_circuit[j]));
	//			strcat(resultat, ",");
	//		}
	//	}
	//}
	////Si on a trouv� des liens, il va y avoir une virgule (,) en trop � la fin
	////--> On l'enl�ve
	//if (strlen(resultat)) 
	//{
	//	resultat[strlen(resultat)-1] = '\0';
	//}
}





