//
// Created by cedric on 2023-11-07.
//

#include "Utilitaires.h"
#include "labyrinthe.h"
#include "labyrinthe_io.h"
#include "pile.h"



int nb_aleatoire(int min, int max)
{
        srand((unsigned int)time(NULL));
        rand();

        return min + (int)(rand() / (RAND_MAX + 0.001) * (max - min + 1));
}



void test_calculer_deplacements_possibles(void)
{

    int nb_possibles;
    int deplacements[4][2];
    int nb_deplacements;
    int point_entree[2]; //Stocke les coordonnées du point d'entrée du labyrinthe lors du chargement
    int hauteur_grille, largeur_grille; //Stocke la taille de la grille chargée depuis le disque
    int grille[TAILLE_MAX_GRILLE][TAILLE_MAX_GRILLE];
    int sol_par[TAILLE_MAX_GRILLE][2];

    //charger la grille depuis le disque ici
    charger_labyrinthe("../grille1.txt", grille, point_entree, &hauteur_grille, &largeur_grille);

    //Ci-dessous, on reproduit la solution partielle telle
    pile_initialiser(sol_par, TAILLE_MAX_GRILLE);
    pile_empiler(sol_par, 0, 10);
    pile_empiler(sol_par, 1, 10);
    pile_empiler(sol_par, 1, 9);
    pile_empiler(sol_par, 1, 8);
    pile_empiler(sol_par, 2, 8);
    pile_empiler(sol_par, 3, 8);

    lab_calculer_deplacements_possibles(grille, 12, 12, 3, 8, sol_par,&nb_deplacements,deplacements);

    printf("\nLe nombre de deplacment possible est %d\n", nb_deplacements);

}




void Executable_labyrinthe(void)
{

    int grille[TAILLE_MAX_GRILLE][TAILLE_MAX_GRILLE]; //Tableau 2D qui contient la grille du labyrinthe
    int point_entree[2]; //Stocke les coordonnées du point d'entrée du labyrinthe lors du chargement
    int hauteur_grille, largeur_grille; //Stocke la taille de la grille chargée depuis le disque
    int succes_chargement; //Stocke une valeur vraie si la grille a été chargée correctement.
    int grille_chargee = 0; //aucune grille-charge au début
    int pile_solutions[TAILLE_MAX_GRILLE][2];

    int choix;
    char nom_fichier[12];
    char chemin_fichier[12];

    int debug;

    do {

            choix = selection_menu(grille_chargee);

            switch(choix)
            {
                 case 1:
                 menu_charger_labyrinthe(nom_fichier, sizeof(nom_fichier));

                 sprintf(chemin_fichier, "../%s", nom_fichier);

                 succes_chargement = charger_labyrinthe(chemin_fichier, grille, point_entree, &hauteur_grille, &largeur_grille);

                    if (succes_chargement == 1)
                    {
                    printf("\nGrille chargee avec succes:\n");
                    grille_chargee = 1;
                    lab_afficher_grille(grille, hauteur_grille, largeur_grille, pile_solutions);
                    system("pause");
                     }
                    else if(!succes_chargement)
                    {
                    printf("\nErreur lors du téléchargement de la grille\n");
                    }
                    break;


                case 2:
                    int g;

                    int solution_colonne;
                    int solution_ligne;
                    lab_resoudre_profondeur(grille, hauteur_grille, largeur_grille, point_entree, pile_solutions, 1);

                    for(int i =0; i <  pile_taille_pile(pile_solutions) ;i++)
                    {
                        pile_depiler(pile_solutions,&solution_ligne,&solution_colonne);
                    }

                    lab_afficher_grille(grille, hauteur_grille, largeur_grille,pile_solutions);

                    system("pause");
                    break;

                case 3:

                    lab_resoudre_profondeur(grille, hauteur_grille, largeur_grille,point_entree,pile_solutions ,1);

                    lab_afficher_grille(grille, hauteur_grille, largeur_grille,pile_solutions);
                    system("pause");

                    break;

                case 4:
                    return EXIT_SUCCESS;
                    break;


             }

    }
    while(1);
}

