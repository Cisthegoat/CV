/*
Module: labyrinthe_io

Auteur: 

Date: 
*/


/***********COMMANDES PRÉPROCESSEUR*************/
#include "labyrinthe_io.h"



/*******IMPLEMENTATION DES FONCTIONS***********/
int charger_labyrinthe(char* nom_fichier, int grille[][TAILLE_MAX_GRILLE], int point_entree[2], int* hauteur_grille, int* largeur_grille)
{
	FILE* fichier;
	char caractere_lu;
	int i = 0, //Compteurs d'indices dans le tableau
		j = 0;
	fichier = fopen(nom_fichier, "r");
	if (!fichier)
	{
		return 0;
	}

	*largeur_grille = -1;
	*hauteur_grille = -1;

	while ((caractere_lu = getc(fichier)) != EOF)
	{
		switch (caractere_lu)
		{
		case '*':
			grille[i][j] = 1;
			j++;
			break;
		case ' ':
			grille[i][j] = 0;
			j++;
			break;
		case 'E':
			grille[i][j] = 0;
			point_entree[0] = i;
			point_entree[1] = j;
			j++;
			break;
		case '\n':
			if (*largeur_grille != -1 && *largeur_grille != j) {
				printf("ERREUR DE LECTURE: Les lignes du labyrinthe n'ont pas toutes le même nombre de colonnes.\n");
				return 0;
			}
			*largeur_grille = j;
			j = 0;
			i++;
			break;
		}
	}
	*hauteur_grille = i + 1;
	fclose(fichier);
	return 1;
}


int selection_menu(int grille_chargee)
{
            int choix;

            printf("\n\t1. Charger un labyrinthe\n");

    if(grille_chargee)
    {
            printf("\t2. Resoudre le labyrinthe\n");
            printf("\t3. Resoudre le labyrinthe pas-a-pas\n");
    }
    else
    {
            printf("\t2. [Indisponible] Resoudre le labyrinthe\n");
            printf("\t3. [Indisponible] Resoudre le labyrinthe pas-a-pas\n");
    }
            printf("\t4. Quitter le programme\n\n");

    do
    {
             printf("\t> ");
             scanf("%d", &choix);

             if((4 < choix || choix < 1)|| (choix == 2 && !grille_chargee)|| (choix == 3 && !grille_chargee))
             {
                printf("\tChoix invalide!\n\n");
             }
             else
             {
                return choix;
             }

    }
    while(1);
}


void menu_charger_labyrinthe(char* buf_nom_fichier, int buf_taille)
{
    printf("Nom du fichier: ");
    fflush(stdin);
    fgets(buf_nom_fichier, buf_taille,stdin);
}
