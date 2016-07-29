#ifndef GA_H
#define GA_H

#define EPS_CHECK(v) v < FLT_EPSILON && v > -FLT_EPSILON

//for 3d or lower space, use char
//for 4d space, use short
//for 5d space, use int
//as a general rule, for Nd space, use a type that has 2^N bits
#define N_SPACE 5
#define BASIS_TYPE int

typedef unsigned BASIS_TYPE uint;

//the value of a basis vector is val, where val = 0; for(int num : base) val += pow(2, num - 1);
//e.g. e_134 = 2^(1-1) + 2^(3-1) + 2^(4-1) = 1 + 4 + 8 = 13
//these correspond directly to an index in a multivector's components
typedef enum _bvec {
	scalar  = 0U,
	e_1     = 1U,
	e_2     = 2U,
	e_3     = 4U,
	e_12    = 3U,
	e_23    = 6U,
	e_31    = 5U,
	e_123   = 7U,
	e_4     = 8U,
	e_14    = 9U,
	e_24    = 10U,
	e_34    = 12U,
	e_124   = 11U,
	e_134   = 13U,
	e_234   = 14U,
	e_1234  = 15U,
	e_5     = 16U,
	e_15    = 17U,
	e_25    = 18U,
	e_35    = 20U,
	e_45    = 24U,
	e_125   = 19U,
	e_135   = 21U,
	e_145   = 25U,
	e_235   = 22U,
	e_245   = 26U,
	e_345   = 28U,
	e_1235  = 23U,
	e_1245  = 27U,
	e_1345  = 29U,
	e_2345  = 30U,
	e_12345 = 31U
} bvec;

typedef struct _mvec {
	float components[sizeof(uint) * 8U];
} mvec;

float _bladeCoeff;
uint blades[sizeof(uint) * 8U];

//helper functions
float factorial(uint n);
uint msb(uint n);
uint lsb(uint n);
uint numSetBits(uint n);

//component-related functions
void zeroMV(mvec* v);
void copyMV(mvec* dest, mvec* src);
void setComponent(bvec e, float val, mvec* v);
void destructMV();
mvec addMV(mvec l, mvec r);
mvec subMV(mvec l, mvec r);
mvec multMV(mvec l, float f);
mvec divMV(mvec l, float f);
char equalMV(mvec a, mvec b);

//sign-related functions
int bsign(bvec i);
int invSign(bvec l, bvec r);

//blade-related functions
void genBlades();
float bladeCoeff();
uint blade(mvec v);
mvec getBasis(bvec e);
mvec grade(mvec v, uint g);
bvec pseudoScalar(uint n);
mvec pseudoScalarMV(uint n);

//product functions
mvec geoProduct(mvec l, mvec r);
mvec innerProduct(mvec l, mvec r);
mvec outerProduct(mvec l, mvec r);

//operators
mvec dual(mvec v);
mvec reverse(mvec v);
mvec inverse(mvec v);
mvec meet(mvec l, mvec r);

//print functions
void printBV(bvec e);
void printMV(mvec v);

#endif
