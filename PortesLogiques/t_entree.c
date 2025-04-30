//
// Created by cedri on 2023-11-20.
//

#include "t_entree.h"

t_entree *t_entree_init(int num)
{
    t_entree * entree;

    entree = (t_entree*)malloc(sizeof(t_entree));

    if(entree == NULL)
    {
        free(entree);

        return NULL;
    }

    entree->nom = (char*) malloc(sizeof(char)*NOM_ENTREE_TAILLE_MAX);

    if(entree->nom == NULL)
    {
        free(entree);

        return NULL;
    }

    entree -> id = num;


    sprintf(entree->nom,"E%i",num);

    entree->pin = t_pin_sortie_init();

     if(entree->pin == NULL)
     {
         free(entree->nom);
         free(entree);

         return NULL;
     }

    return entree;
}

void t_entree_destroy(t_entree *entree)
{
    /* Pour tester
    t_entree **entre_ptr = entree;

    t_pin_sortie_destroy((*entre_ptr)->pin);

    free((*entre_ptr)->nom);

    free(*entre_ptr);

    *entre_ptr = NULL;
    */

        t_pin_sortie_destroy(entree->pin);

        free(entree->nom);

        free(entree);


}

t_pin_sortie *t_entree_get_pin(t_entree *entree)
{
    t_pin_sortie *pin;

    pin = entree->pin;

    return pin;
}


int t_entree_est_reliee(t_entree *entree)
{
    int relier = 0;

    relier = t_pin_sortie_est_reliee(entree->pin);


    return relier;
}

void t_entree_reset(t_entree *entree)
{
    t_pin_sortie_reset(entree->pin);

}

int t_entree_propager_signal(t_entree *entree)
{
    t_pin_sortie_propager_signal(entree->pin);

    if(t_pin_sortie_propager_signal(entree->pin) != -1)
    {

        return 1;
    }

    return 0;

}

int t_entree_get_valeur(t_entree *entree)
{
    int signal;

    signal = t_pin_sortie_get_valeur(entree->pin);


    return signal;

}



