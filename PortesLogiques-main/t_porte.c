//
// Created by cedri on 2023-11-20.
//
#include "t_porte.h"

t_porte *t_porte_init(int id, e_types_portes type)
{
    t_porte * porte = (t_porte*) malloc(sizeof(t_porte));

    if( porte == NULL)
    {

        return NULL;
    }

    porte->id = id;
    porte->type = type;

    porte->nom = (char*) malloc(sizeof(char)*NOM_PORTE_TAILLE_MAX);

    if(porte->nom == NULL)
    {
        free(porte);

        return NULL;
    }

    sprintf(porte->nom,"P%i",id);

    if(porte->type == PORTE_NOT)
    {
        porte->nb_entrees = 1;

    }
    else
    {
        porte->nb_entrees = 2;

    }

    for(int i =0;i<porte->nb_entrees;i++)
    {
        porte->entrees[i] = t_pin_entree_init();

    }

    porte->sortie = t_pin_sortie_init();


    return porte;
}

void t_porte_destroy(t_porte *porte)
{
    free(porte->nom);

    t_pin_sortie_destroy(porte->sortie);


    for(int i=0;i<porte->nb_entrees;i++)
    {
        t_pin_entree_destroy(porte->entrees[i]);

    }
    free(porte);
}

void t_porte_calculer_sorties(t_porte *porte)
{

    if(porte->type == PORTE_ET)
    {
        if(t_pin_entree_get_valeur(porte->entrees[0]) & t_pin_entree_get_valeur(porte->entrees[1]))
        {
            t_pin_sortie_set_valeur(porte->sortie,1);

        }
        else
        {
            t_pin_sortie_set_valeur(porte->sortie,0);


        }
    }

    if(porte->type == PORTE_OU)
    {
        if(t_pin_entree_get_valeur(porte->entrees[0]) | t_pin_entree_get_valeur(porte->entrees[1]))
        {
            t_pin_sortie_set_valeur(porte->sortie,1);

        }
        else
        {

            t_pin_sortie_set_valeur(porte->sortie,0);

        }
    }

    if(porte->type == PORTE_XOR)
    {
        if(t_pin_entree_get_valeur(porte->entrees[0]) ^ t_pin_entree_get_valeur(porte->entrees[1]))
        {
            t_pin_sortie_set_valeur(porte->sortie,1);

        }
        else
        {
            t_pin_sortie_set_valeur(porte->sortie,0);


        }
    }

    if(porte->type == PORTE_NOT)
    {
        if(t_pin_entree_get_valeur(porte->entrees[0]) == 0)
        {
            t_pin_sortie_set_valeur(porte->sortie,1);

        }
        else
        {
            t_pin_sortie_set_valeur(porte->sortie,0);


        }
    }

}

int t_porte_relier(t_porte *dest, int num_entree, t_pin_sortie *source)
{
    t_pin_entree_relier( dest->entrees[num_entree],source);

    if(dest->entrees[num_entree] == NULL)
    {

        return 0;
    }

    return 1;
}

int t_porte_est_reliee(t_porte *porte)
{

   for(int i = 0;i<porte->nb_entrees;i++)
   {
       if(t_pin_entree_est_reliee(porte->entrees[i]) == 0)
       {

           return 0;
       }
   }


    return t_pin_sortie_est_reliee(porte->sortie);

}

void t_porte_reset(t_porte *porte)
{

    t_pin_sortie_reset(porte->sortie);

    if(porte->type == PORTE_NOT)
    {
        t_pin_entree_reset(porte->entrees[0]);

    }
    else
    {
        t_pin_entree_reset(porte->entrees[0]);
        t_pin_entree_reset(porte->entrees[1]);

    }
}

int t_porte_propager_signal(t_porte *porte)
{

        if(t_pin_entree_get_valeur(porte->entrees[0]) != -1 && t_pin_entree_get_valeur(porte->entrees[porte->nb_entrees-1]) != -1)
        {
            t_porte_calculer_sorties(porte);
            t_pin_sortie_propager_signal(porte->sortie);


            return 1;
        }


    return 0;

}

t_pin_sortie* t_porte_get_pin_sortie(t_porte* porte)
{
    t_pin_sortie_get_valeur(porte->sortie);


    return porte->sortie;

}




