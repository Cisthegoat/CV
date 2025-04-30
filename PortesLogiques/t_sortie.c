//
// Created by cedri on 2023-11-20.
//

#include "t_sortie.h"


 t_sortie *t_sortie_init(int num)
 {
    t_sortie * sortie;

    sortie = (t_sortie*)malloc(sizeof(t_sortie));

    if(sortie == NULL)
    {
        free(sortie);

        return NULL;
    }

     sortie->nom = (char*) malloc( sizeof (char)*NOM_SORTIE_TAILLE_MAX);

    sortie -> id = num;

     if(sortie->nom == NULL)
     {

         free(sortie);

         return NULL;
     }
     sprintf(sortie ->nom, "S%i",num);


     sortie->pin = t_pin_entree_init();


    if(sortie->pin == NULL)
    {
            free(sortie->nom);
            free(sortie);

            return NULL;

    }

    return sortie;
}

void t_sortie_destroy(t_sortie *sortie)
{
    free(sortie->nom);
    t_pin_entree_destroy(sortie->pin);
    free(sortie);

}

t_pin_entree *t_sortie_get_pin(t_sortie *sortie)
{
    t_pin_entree *pin;

    pin = sortie->pin;


    return pin;
}

int t_sortie_relier(t_sortie *dest, t_pin_sortie *source)
{
    t_pin_entree_relier(dest->pin , source);

    if (dest->pin->liaison == NULL)
    {

        return 0;
    }
    else
    {

        return 1;
    }
}

int t_sortie_est_reliee(t_sortie *sortie)
{
int relier;

relier = t_pin_entree_est_reliee(sortie->pin);

return relier;
}

void t_sortie_reset(t_sortie *sortie)
{
    t_pin_entree_reset(sortie->pin);

}

int t_sortie_get_valeur(t_sortie *sortie)
{

    return  t_pin_entree_get_valeur(sortie->pin);
}