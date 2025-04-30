//
// Created by Lounis Benhamouche on 2023-10-16.
//


#include "labyrinthe.h"
#include <math.h>

/*******Implémentation des fonction******/

//pile solution pour afficher solution partielle ou complète

void lab_afficher_grille (int grille[][TAILLE_MAX_GRILLE],int hauteur_grille,int largeur_grille,int pile_solution[][2])
{
    char mur = 219;

    for(int i = 0 ; i < hauteur_grille; i++)
    {
        for (int j = 0; j < largeur_grille; j++)
        {
            if (grille[i][j] == 1)
            {
                printf("%c", mur);
            }
            else if (grille[i][j] == 0)
            {
                printf(" ");
            }
            if(pile_est_vide(pile_solution) == 0)
            {
                for(int k=1;k<pile_taille_pile(pile_solution);k++)
                {
                    for (int l = 0; l < 2; l++)
                    {
                        printf("X");
                    }
                }
            }
        }
        printf("\n");
    }
}

void lab_calculer_deplacements_possibles(int grille[][TAILLE_MAX_GRILLE],int hauteur_grille,int largeur_grille,int pos_ligne,int pos_colonne,int solution_partielle[][2],int* nb_deplacements,int deplacement[4][2])
{

    int x[2];
    int p[2];
    int nb_deplacement=0;
    int copie[4][2];

    pile_haut_pile(solution_partielle,&pos_ligne,&pos_ligne);

    p[0] = pos_ligne;
    p[1] = pos_colonne;

    for(int i=0;i<4;i++)
    {
        copie[i][0]= pos_ligne;
        copie[i][1]= pos_colonne;
    }

    copie[0][0] = pos_ligne +1;
    copie[1][0] = pos_ligne -1;

    copie[2][1] = pos_colonne +1;
    copie[3][1] = pos_colonne -1;

   for(int i=0;i<4;i++)
   {
       x[0] = copie[i][0];
       x[1] = copie[i][1];

       if(grille[x[0]][x[1]] != 1 && pile_contient(solution_partielle,x[0],x[1])==0 && lab_est_cases_adjacentes(x,p)!=0)
       {
            nb_deplacement ++;
            deplacement[i][0] = x[0];
            deplacement[i][1] = x[1];
       }
   }
   *nb_deplacements = nb_deplacement;
}

int lab_choisir_deplacement(int deplacements_possibles[][2],int nb_deplacements_possibles)
{
    int indice;

    nb_deplacements_possibles = 0;

    for(int i=0;i<4;i++)
    {
        if(deplacements_possibles[i][0] != 0 && deplacements_possibles[i][1] != 0)
        {
            nb_deplacements_possibles++;
        }
    }

    indice = nb_aleatoire(0,nb_deplacements_possibles);

    return indice;
}

int lab_est_cases_adjacentes(int case1[2], int case2[2])
{
    if (abs(case1[0] - case2[0]) + abs(case1[1] - case2[1]) == 1)
    {
        return 1;
    }
    else
    {
        return 0;
    }
}

int lab_est_une_sortie(int position[2],int grille[][TAILLE_MAX_GRILLE],int hauteur_grille,int largeur_grille)
{
    if (grille[position[0]][position[1]]  != 1 && position[0] == hauteur_grille || grille[position[0]][position[1]] != 1 && position[1] == largeur_grille)
    {
        return 1;
    }
    else
    {
        return 0;
    }
}


int lab_resoudre_profondeur(int grille[][TAILLE_MAX_GRILLE],int hauteur_grille,int largeur_grille,int entree[2],int pile_solution[][2],int debug)
{

    int nb_deplacments_possibles;
    int deplacements_possibles[4][2];
    int nouvelle_position[2];
    int position[2];
    int position_ligne;
    int position_colonne;
    int nposition_ligne;
    int nposition_colonne;
    int pile_chemin_alternatif[][2] = {0};
    int sortie[2];
    int ligne_sortie;
    int colonne_sortie;

    pile_initialiser(pile_chemin_alternatif, TAILLE_MAX_GRILLE);
    pile_initialiser(pile_solution, TAILLE_MAX_GRILLE);

    pile_empiler(pile_solution, entree[0], entree[1]);

    nouvelle_position[0] = entree[0];
    nouvelle_position[1] = entree[1];
    for (int i = 0; i < hauteur_grille; i++) {
        for (int j = 0; j < largeur_grille; j++) {
            sortie[0] = i;
            sortie[1] = j;

            if (lab_est_une_sortie(sortie, grille, hauteur_grille, largeur_grille)) {
                ligne_sortie = i;
                colonne_sortie = j;

                i = hauteur_grille;
                j = largeur_grille;
            }
        }
    }

    do {
        lab_calculer_deplacements_possibles(grille, hauteur_grille, largeur_grille, nouvelle_position[0],
                                            nouvelle_position[1], pile_solution, &nb_deplacments_possibles,
                                            deplacements_possibles);

        if (nb_deplacments_possibles > 0) {
            nouvelle_position[0] = deplacements_possibles[lab_choisir_deplacement(deplacements_possibles,
                                                                                  nb_deplacments_possibles)][0];
            nouvelle_position[1] = deplacements_possibles[lab_choisir_deplacement(deplacements_possibles,
                                                                                  nb_deplacments_possibles)][1];

            pile_empiler(pile_solution, nouvelle_position[0], nouvelle_position[1]);

            for (int i = 0; i < nb_deplacments_possibles; i++) {
                if (deplacements_possibles[i][0] != nouvelle_position[0] &&
                    deplacements_possibles[i][1] != nouvelle_position[0]) {
                    pile_empiler(pile_chemin_alternatif, deplacements_possibles[i][0], deplacements_possibles[i][1]);
                }

            }
        } else if (pile_est_vide(pile_chemin_alternatif) == 0) {
            pile_depiler(pile_chemin_alternatif, &position_ligne, &position_colonne);

            position[0] = position_ligne;
            position[1] = position_colonne;

            while (lab_est_cases_adjacentes(nouvelle_position, position) == 0) {
                pile_depiler(pile_solution, &nposition_ligne, &nposition_colonne);
                nouvelle_position[0] = nposition_ligne;
                nouvelle_position[1] = nposition_colonne;
            }

            pile_empiler(pile_solution, nouvelle_position[0], nouvelle_position[1]);

        } else {
            nb_deplacments_possibles = 0;
        }

    } while (pile_contient(pile_solution, ligne_sortie, colonne_sortie) == 0 && nb_deplacments_possibles != 0);

    if (pile_contient(pile_solution, ligne_sortie, colonne_sortie) != 0)
    {
        return 1;
    }
    else
    {
        return 0;
    }
}