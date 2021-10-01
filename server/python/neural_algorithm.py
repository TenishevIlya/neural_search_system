import sys
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from nltk.tokenize import word_tokenize
import os
from bs4 import BeautifulSoup

docs = []

filesAndIndexes = []

filenames = list(sys.argv[1].split(","))

count = 0

module_dir = os.path.dirname(__file__)


for filename in filenames:
    with open(os.path.join(module_dir, '..\web_pages\{}').format(filename), encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')
        res = soup.p.string.split(".")
        filesAndIndexes.append((count, count + len(res) - 1))
        count = count + len(res)
        for r in res:
            docs.append(r.strip())



doc_with_tokens = []

for d in docs:
    doc_with_tokens.append(word_tokenize(d.lower()))


tagged_data = [TaggedDocument(d, [i]) for i, d in enumerate(doc_with_tokens)]

model = Doc2Vec(tagged_data, vector_size=20, window=2, min_count=1, workers=4, epochs = 10000)

model.save(os.path.join(module_dir, 'test_doc2vec.model'))

model = Doc2Vec.load(os.path.join(module_dir, 'test_doc2vec.model'))


doc_to_find = word_tokenize(sys.argv[2])

mostSimilar = model.dv.most_similar(positive=[model.infer_vector(doc_to_find)],topn=7)


final = []

for item in mostSimilar:
    for iteration, i in enumerate(filesAndIndexes):
        if i[0] <= item[0] <= i[1]:
            final.append(filenames[iteration])


def get_unique_numbers(numbers):
    unique = []

    for number in numbers:
        if number in unique:
            continue
        else:
            unique.append(number)
    return unique


print(get_unique_numbers(final))            
