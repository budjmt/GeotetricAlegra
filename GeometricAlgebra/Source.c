#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#include "GA.h"

extern uint N_BIT;
extern uint MID;
extern uint HIGH;

void setupMV() {
	printf("Setting up...\n");
	srand((unsigned)time(NULL));
	genBlades();
	printf("Done.\n\n");
}

void test_bit() {
	printf("Bit Tests:\n");
	for (bvec i = 0; i < N_BIT; i++) {
		printBV(i);
		printf(": ");
		printBV(msb(i));
		printf(" ");
		printBV(lsb(i));
		printf("\n");
	}
}

void test_numBits() {
	printf("Num Bit Tests:\n");
	for (bvec i = 0; i < N_BIT; i++) {
		printBV(i);
		printf(": %d\n", numSetBits(i));
	}
}

void test_basisMult() {
	printf("Basis Multiplication Tests:\n");
	for (bvec i = 0; i < N_BIT; i++) {
		for (bvec j = 0; j < N_BIT; j++) {
			printBV(i);
			printf(", ");
			printBV(j);
			printf(": %c", invSign(i, j) > 0 ? '+' : '-');
			printBV(i ^ j);
			printf("\n");
		}
	}
}

void test_pseudoScalar() {
	printf("Pseudo-Scalar Tests:\n");
	for (bvec i = 0; i < N_BIT; i++) {
		printBV(i);
		printf(": ");
		printBV(pseudoScalar(blades[i]));
		printf("\n");
	}
}

void test_blades() {
	printf("Blades: \n");
	for (uint i = 0; i < N_BIT; i++) {
		printBV(i);
		printf(": %d\n", blades[i]);
	}
}

int main() {
	setupMV();

	//test_blades();

	//test_bit();
	//test_numBits();
	//test_basisMult();
	//test_pseudoScalar();

	mvec a, b;
	zeroMV(&a);
	zeroMV(&b);
	setComponent(e_1,   4, &a);
	setComponent(e_12,  3, &a);
	setComponent(e_31,  5, &a);
	setComponent(e_2,   2, &a);
	for (int i = 0; i < 5; i++)
		b.components[rand() % N_BIT] = (float)(rand() % 10);
	/*setComponent(scalar, 6, &b);
	setComponent(e_1, 2, &b);
	setComponent(e_2, 2, &b);
	setComponent(e_23, 7, &b);*/
	
	printMV(a);
	printf("\n");
	printMV(b);
	printf("\n\n");

	mvec r = geoProduct(a, b);
	printf("ab = ");
	printMV(r);
	printf("\n\n");

	mvec ip = innerProduct(a, b), op = outerProduct(a, b), res = addMV(ip, op);
	printf("a . b = ");
	printMV(ip);
	printf("\na ^ b = ");
	printMV(op);
	//printf("\na . b + a ^ b = ");
	//printMV(res);
	printf("\na . b + a ^ b == ab: %s\n\n", equalMV(r, res) ? "true" : "false");
	
	printf("b* = ");
	printMV(dual(b));
	printf("\nb** = ");
	printMV(dual(dual(b)));
	printf("\nb*** = ");
	printMV(dual(dual(dual(b))));
	printf("\nb**** = b = ");
	mvec bdddd = dual(dual(dual(dual(b))));
	printMV(bdddd);
	printf("\n");
	printf("b == b****: %s\n\n", equalMV(b, bdddd) ? "true" : "false");

	printf("~a = ");
	printMV(reverse(a));
	printf("\n~b = ");
	mvec b_r = reverse(b);
	printMV(b_r);
	//printf("\n~bb = ");
	//printMV(geoProduct(b_r, b));
	printf("\n\n");

	/*mvec b_inv = inverse(b);
	printf("b^-1 = ");
	printMV(b_inv);
	printf("\nbb^-1 = ");
	printMV(geoProduct(b, b_inv));
	printf("\nb^-1b = ");
	printMV(geoProduct(b_inv, b));
	printf("\n\n");*/
	
	printf("a %c b = ", 239);
	printMV(meet(a, b));
	printf("\n\n");

	destructMV();
	return 0;
}